import { onMounted, watch, type Ref } from 'vue';
import { useInsertScriptTags } from '../../tools/useInsertScriptTags';
import { assert } from 'keycloakify/tools/assert';
import { waitForElementMountedOnDom } from 'keycloakify/tools/waitForElementMountedOnDom';
import type { KcContext } from 'keycloakify/login/KcContext';

type KcContextLike = {
  url: {
    resourcesPath: string;
  };
  challenge: string;
  userid: string;
  username: string;
  signatureAlgorithms: string[];
  rpEntityName: string;
  rpId: string;
  attestationConveyancePreference: string;
  authenticatorAttachment: string;
  requireResidentKey: string;
  userVerificationRequirement: string;
  createTimeout: number | string;
  excludeCredentialIds: string;
};

assert<keyof KcContextLike extends keyof KcContext.WebauthnRegister ? true : false>();
assert<KcContext.WebauthnRegister extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (
    key:
      | 'webauthn-registration-init-label'
      | 'webauthn-registration-init-label-prompt'
      | 'webauthn-unsupported-browser-text',
  ) => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: { authButtonId: string; kcContext: KcContextLike; i18n: Ref<I18nLike> }) {
  const { authButtonId, kcContext, i18n } = params;

  const {
    url,
    challenge,
    userid,
    username,
    signatureAlgorithms,
    rpEntityName,
    rpId,
    attestationConveyancePreference,
    authenticatorAttachment,
    requireResidentKey,
    userVerificationRequirement,
    createTimeout,
    excludeCredentialIds,
  } = kcContext;

  const { insertScriptTags } = useInsertScriptTags({
    componentOrHookName: 'WebauthnRegister',
    scriptTags: [
      {
        type: 'module',
        textContent: () => `
                    import { registerByWebAuthn } from "${url.resourcesPath}/js/webauthnRegister.js";
                    const registerButton = document.getElementById('${authButtonId}');
                    registerButton.addEventListener("click", function() {
                        const input = {
                            challenge : '${challenge}',
                            userid : '${userid}',
                            username : '${username}',
                            signatureAlgorithms : ${JSON.stringify(signatureAlgorithms)},
                            rpEntityName : ${JSON.stringify(rpEntityName)},
                            rpId : ${JSON.stringify(rpId)},
                            attestationConveyancePreference : ${JSON.stringify(attestationConveyancePreference)},
                            authenticatorAttachment : ${JSON.stringify(authenticatorAttachment)},
                            requireResidentKey : ${JSON.stringify(requireResidentKey)},
                            userVerificationRequirement : ${JSON.stringify(userVerificationRequirement)},
                            createTimeout : ${createTimeout},
                            excludeCredentialIds : ${JSON.stringify(excludeCredentialIds)},
                            initLabel : ${JSON.stringify(i18n.value.msgStr('webauthn-registration-init-label'))},
                            initLabelPrompt : ${JSON.stringify(i18n.value.msgStr('webauthn-registration-init-label-prompt'))},
                            errmsg : ${JSON.stringify(i18n.value.msgStr('webauthn-unsupported-browser-text'))}
                        };
                        registerByWebAuthn(input);
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
