import { onMounted, watch, type Ref } from 'vue';
import { useInsertScriptTags } from '../../tools/useInsertScriptTags';
import { assert } from 'keycloakify/tools/assert';
import { waitForElementMountedOnDom } from 'keycloakify/tools/waitForElementMountedOnDom';
import type { KcContext } from 'keycloakify/login/KcContext';

type KcContextLike = {
  url: {
    resourcesPath: string;
  };
  isUserIdentified: 'true' | 'false';
  challenge: string;
  userVerification: KcContext.WebauthnAuthenticate['userVerification'];
  rpId: string;
  createTimeout: number | string;
  enableWebAuthnConditionalUI?: boolean;
};

assert<keyof KcContextLike extends keyof KcContext.LoginPassword ? true : false>();
assert<KcContext.LoginPassword extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (key: 'webauthn-unsupported-browser-text' | 'passkey-unsupported-browser-text') => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: { webAuthnButtonId: string; kcContext: KcContextLike; i18n: Ref<I18nLike> }) {
  const { webAuthnButtonId, kcContext, i18n } = params;

  const { url, isUserIdentified, challenge, userVerification, rpId, createTimeout } = kcContext;

  const { insertScriptTags } = useInsertScriptTags({
    componentOrHookName: 'LoginPassword',
    scriptTags: [
      {
        type: 'module',
        textContent: () => `

                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${url.resourcesPath}/js/passkeysConditionalAuth.js";
                    const authButton = document.getElementById('${webAuthnButtonId}');
                    const input = {
                        isUserIdentified : ${isUserIdentified},
                        challenge : ${JSON.stringify(challenge)},
                        userVerification : ${JSON.stringify(userVerification)},
                        rpId : ${JSON.stringify(rpId)},
                        createTimeout : ${createTimeout}
                    };
                    authButton.addEventListener("click", () => {
                        authenticateByWebAuthn({
                            ...input,
                            errmsg : ${JSON.stringify(i18n.value.msgStr('webauthn-unsupported-browser-text'))}
                        });
                    }, { once: true });

                    initAuthenticate({
                        ...input,
                        errmsg : ${JSON.stringify(i18n.value.msgStr('passkey-unsupported-browser-text'))}
                    });
                `,
      },
    ],
  });

  onMounted(() => {
    if (kcContext.enableWebAuthnConditionalUI !== true) {
      return;
    }

    const stopWatch = watch(
      () => i18n.value.isFetchingTranslations,
      async (isFetching) => {
        if (isFetching) {
          return;
        }

        stopWatch();

        await waitForElementMountedOnDom({
          elementId: webAuthnButtonId,
        });

        insertScriptTags();
      },
      { immediate: true },
    );
  });
}
