<script setup lang="ts">
import type { ClassKey } from "keycloakify/login/lib/kcClsx";
import { DefaultPage, Template } from "../../src/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";

const props = defineProps<{ kcContext: KcContext }>();

const { i18n } = useI18n({ kcContext: props.kcContext });

const classes = {} satisfies { [key in ClassKey]?: string };

// `doUseDefaultCss: false` so Template's `isReadyToRender` gate (which waits on
// PatternFly stylesheet `load` events) resolves immediately — pages render
// reliably (structurally complete, unstyled) in the library's Storybook.
// Fully-styled stories run from keycloakify-starter-vue, where the keycloakify
// vite-plugin serves PatternFly in a real consumer context (Phase D).
const doUseDefaultCss = false;
</script>

<template>
    <DefaultPage
        :kcContext="kcContext"
        :i18n="i18n"
        :classes="classes"
        :Template="Template"
        :doUseDefaultCss="doUseDefaultCss"
    />
</template>
