import { assert } from "keycloakify/tools/assert";
import { watch, type Ref } from "vue";
import { useInsertLinkTags } from "../tools/useInsertLinkTags";
import { useInsertScriptTags } from "../tools/useInsertScriptTags";
import type { KcContext } from "keycloakify/login/KcContext";

export type KcContextLike = {
    url: {
        resourcesCommonPath: string;
        resourcesPath: string;
        ssoLoginInOtherTabsUrl: string;
    };
    scripts?: string[];
    authenticationSession?: {
        authSessionIdHash: string;
    };
};

assert<keyof KcContextLike extends keyof KcContext ? true : false>();
assert<KcContext extends KcContextLike ? true : false>();

export function useInitialize(params: { kcContext: KcContextLike; doUseDefaultCss: boolean }): {
    isReadyToRender: Ref<boolean>;
} {
    const { kcContext, doUseDefaultCss } = params;
    const { url, scripts } = kcContext;

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                  `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                  `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
                  `${url.resourcesPath}/css/login.css`
              ]
    });

    const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: "Template",
        scriptTags: [
            { type: "module", src: `${url.resourcesPath}/js/menu-button-links.js` },
            ...(scripts === undefined
                ? []
                : scripts.map(src => ({ type: "text/javascript" as const, src }))),
            {
                type: "module",
                textContent: [
                    `import { startSessionPolling, checkAuthSession } from "${url.resourcesPath}/js/authChecker.js";`,
                    ``,
                    `startSessionPolling("${kcContext.url.ssoLoginInOtherTabsUrl}");`,
                    kcContext.authenticationSession === undefined
                        ? ""
                        : `checkAuthSession("${kcContext.authenticationSession.authSessionIdHash}");`
                ].join("\n")
            }
        ]
    });

    watch(
        areAllStyleSheetsLoaded,
        isReadyToRender => {
            if (isReadyToRender) {
                insertScriptTags();
            }
        },
        { immediate: true }
    );

    return { isReadyToRender: areAllStyleSheetsLoaded };
}
