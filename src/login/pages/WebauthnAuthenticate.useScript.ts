import { onMounted, watch, type Ref } from "vue";
import { useInsertScriptTags } from "../../tools/useInsertScriptTags";
import { assert } from "keycloakify/tools/assert";
import { waitForElementMountedOnDom } from "keycloakify/tools/waitForElementMountedOnDom";
import type { KcContext } from "keycloakify/login/KcContext";

type KcContextLike = {
  url: {
    resourcesPath: string;
  };
  isUserIdentified: "true" | "false";
  challenge: string;
  userVerification: KcContext.WebauthnAuthenticate["userVerification"];
  rpId: string;
  createTimeout: number | string;
};

assert<
  keyof KcContextLike extends keyof KcContext.WebauthnAuthenticate
    ? true
    : false
>();
assert<KcContext.WebauthnAuthenticate extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (key: "webauthn-unsupported-browser-text") => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: {
  authButtonId: string;
  kcContext: KcContextLike;
  i18n: Ref<I18nLike>;
}) {
  const { authButtonId, kcContext, i18n } = params;

  const {
    url,
    isUserIdentified,
    challenge,
    userVerification,
    rpId,
    createTimeout,
  } = kcContext;

  const { insertScriptTags } = useInsertScriptTags({
    componentOrHookName: "WebauthnAuthenticate",
    scriptTags: [
      {
        type: "module",
        textContent: () => `

                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    const authButton = document.getElementById('${authButtonId}');
                    authButton.addEventListener("click", function() {
                        const input = {
                            isUserIdentified : ${isUserIdentified},
                            challenge : '${challenge}',
                            userVerification : '${userVerification}',
                            rpId : '${rpId}',
                            createTimeout : ${createTimeout},
                            errmsg : ${JSON.stringify(i18n.value.msgStr("webauthn-unsupported-browser-text"))}
                        };
                        authenticateByWebAuthn(input);
                    });
                `,
      },
    ],
  });

  onMounted(() => {
    const stopWatch = watch(
      () => i18n.value.isFetchingTranslations,
      async (isFetching) => {
        if (isFetching) {
          return;
        }

        stopWatch();

        await waitForElementMountedOnDom({
          elementId: authButtonId,
        });

        insertScriptTags();
      },
      { immediate: true },
    );
  });
}
