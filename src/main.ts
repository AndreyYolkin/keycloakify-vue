import { createApp } from "vue";
import KcPage from "./kc.gen.vue";
import type { KcContext } from "./kc.gen";

async function main() {
    if (import.meta.env.DEV && window.kcContext === undefined) {
        const { createGetKcContextMock } = await import("keycloakify/login/KcContext");
        const { getKcContextMock } = createGetKcContextMock({
            kcContextExtension: { themeName: "keycloakify-vue-poc", properties: {} },
            kcContextExtensionPerPage: {},
            overrides: {}
        });
        window.kcContext = getKcContextMock({ pageId: "login.ftl" }) as KcContext;
    }

    if (window.kcContext !== undefined) {
        createApp(KcPage, { kcContext: window.kcContext }).mount("#kc-root");
    }
}

main();
