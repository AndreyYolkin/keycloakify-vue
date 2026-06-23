import { createApp } from "vue";
import KcPage from "./kc.gen.vue";

// A dev mock is added in the next task. In Keycloak, window.kcContext is injected by the FTL.
if (window.kcContext !== undefined) {
    createApp(KcPage, { kcContext: window.kcContext }).mount("#kc-root");
}
