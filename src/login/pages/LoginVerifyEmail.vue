<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>>();

const kcContext = props.kcContext;
const { url, user } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayInfo="true"
    >
        <template #header>
            <component :is="props.i18n.msg('emailVerifyTitle')" />
        </template>

        <template #info>
            <p class="instruction">
                <component :is="props.i18n.msg('emailVerifyInstruction2')" />
                <br />
                <a :href="url.loginAction"><component :is="props.i18n.msg('doClickHere')" /></a>
                &nbsp;
                <component :is="props.i18n.msg('emailVerifyInstruction3')" />
            </p>
        </template>

        <p class="instruction">
            <component :is="props.i18n.msg('emailVerifyInstruction1', user?.email ?? '')" />
        </p>
    </component>
</template>
