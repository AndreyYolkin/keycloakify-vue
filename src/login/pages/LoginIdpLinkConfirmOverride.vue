<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, idpDisplayName } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
    >
        <template #header>
            <component :is="props.i18n.msg('confirmOverrideIdpTitle')" />
        </template>

        <form id="kc-register-form" :action="url.loginAction" method="post">
            <component :is="props.i18n.msg('pageExpiredMsg1')" />
            {{ " " }}
            <a id="loginRestartLink" :href="url.loginRestartFlowUrl">
                <component :is="props.i18n.msg('doClickHere')" />
            </a>
            <br />
            <br />
            <button
                type="submit"
                :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                name="submitAction"
                id="confirmOverride"
                value="confirmOverride"
            >
                <component :is="props.i18n.msg('confirmOverrideIdpContinue', idpDisplayName)" />
            </button>
        </form>
    </component>
</template>
