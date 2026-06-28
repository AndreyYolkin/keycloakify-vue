<script setup lang="ts">
import type { ClassKey } from "keycloakify/login/lib/kcClsx";
import { DefaultPage, Template, UserProfileFormFields } from "../../src/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";

const props = defineProps<{ kcContext: KcContext }>();

const { i18n } = useI18n({ kcContext: props.kcContext });

const classes = {} satisfies { [key in ClassKey]?: string };

// `doUseDefaultCss: false` so Template's `isReadyToRender` gate resolves
// immediately — pages render reliably (unstyled) in the library's Storybook.
const doUseDefaultCss = false;
</script>

<template>
    <DefaultPage
        :kcContext="kcContext"
        :i18n="i18n"
        :classes="classes"
        :Template="Template"
        :UserProfileFormFields="UserProfileFormFields"
        :doUseDefaultCss="doUseDefaultCss"
        :doMakeUserConfirmPassword="true"
    />
</template>
