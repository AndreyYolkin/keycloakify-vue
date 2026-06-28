<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="false"
    >
        <template #header>
            <component :is="props.i18n.msg('termsTitle')" />
        </template>

        <div id="kc-terms-text"><component :is="props.i18n.msg('termsText')" /></div>
        <form class="form-actions" :action="url.loginAction" method="POST">
            <input
                :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                name="accept"
                id="kc-accept"
                type="submit"
                :value="props.i18n.msgStr('doAccept')"
            />
            <input
                :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                name="cancel"
                id="kc-decline"
                type="submit"
                :value="props.i18n.msgStr('doDecline')"
            />
        </form>
        <div class="clearfix" />
    </component>
</template>
