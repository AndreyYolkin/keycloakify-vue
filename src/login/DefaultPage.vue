<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { computed, defineAsyncComponent, type Component } from "vue";
import DefaultUserProfileFormFields from "./components/UserProfileFormFields.vue";
import type { ClassKey } from "./TemplateProps";
import type { I18n } from "./i18n/i18n";
import NotImplemented from "./pages/NotImplemented.vue";

const Login = defineAsyncComponent(() => import("./pages/Login.vue"));
const Register = defineAsyncComponent(() => import("./pages/Register.vue"));

const props = withDefaults(
    defineProps<{
        kcContext: KcContext;
        i18n: I18n;
        classes?: Partial<Record<ClassKey, string>>;
        Template: Component;
        UserProfileFormFields?: Component;
        doUseDefaultCss: boolean;
        doMakeUserConfirmPassword?: boolean;
    }>(),
    {
        classes: undefined,
        UserProfileFormFields: undefined,
        doMakeUserConfirmPassword: true
    }
);

const userProfileFormFields = computed<Component>(() => props.UserProfileFormFields ?? DefaultUserProfileFormFields);

const pageComponent = computed<Component>(() => {
    switch (props.kcContext.pageId) {
        case "login.ftl":
            return Login;
        case "register.ftl":
            return Register;
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
        :UserProfileFormFields="userProfileFormFields"
        :doUseDefaultCss="doUseDefaultCss"
        :doMakeUserConfirmPassword="doMakeUserConfirmPassword"
        :pageId="kcContext.pageId"
    />
</template>
