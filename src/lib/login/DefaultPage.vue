<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { computed, defineAsyncComponent, type Component, type Ref } from "vue";
import type { ClassKey } from "./TemplateProps";
import type { I18n } from "./i18n/i18n";
import NotImplemented from "./pages/NotImplemented.vue";

const props = defineProps<{
    kcContext: KcContext;
    i18n: Ref<I18n>;
    classes?: Partial<Record<ClassKey, string>>;
    Template: Component;
    doUseDefaultCss: boolean;
}>();

const pageComponent = computed<Component>(() => {
    switch (props.kcContext.pageId) {
        case "login.ftl":
            return defineAsyncComponent(() => import("./pages/Login.vue"));
        default:
            return NotImplemented;
    }
});
</script>

<template>
    <component
        :is="pageComponent"
        :kcContext="kcContext"
        :i18n="i18n"
        :classes="classes"
        :Template="Template"
        :doUseDefaultCss="doUseDefaultCss"
        :pageId="kcContext.pageId"
    />
</template>
