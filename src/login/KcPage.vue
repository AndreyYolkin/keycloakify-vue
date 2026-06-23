<script setup lang="ts">
import type { ClassKey } from "keycloakify/login/lib/kcClsx";
import DefaultPage from "../lib/login/DefaultPage.vue";
import Template from "../lib/login/Template.vue";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";

const props = defineProps<{ kcContext: KcContext }>();

const { i18n } = useI18n({ kcContext: props.kcContext });

const classes = {} satisfies { [key in ClassKey]?: string };
</script>

<template>
    <DefaultPage
        :kcContext="kcContext"
        :i18n="i18n"
        :classes="classes"
        :Template="Template"
        :doUseDefaultCss="true"
    />
</template>
