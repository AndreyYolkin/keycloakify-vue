<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, idpAlias } = kcContext;
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
            <component :is="props.i18n.msg('confirmLinkIdpTitle')" />
        </template>

        <form id="kc-register-form" :action="url.loginAction" method="post">
            <div :class="kcClsx('kcFormGroupClass')">
                <button
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                    name="submitAction"
                    id="updateProfile"
                    value="updateProfile"
                >
                    <component :is="props.i18n.msg('confirmLinkIdpReviewProfile')" />
                </button>
                <button
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                    name="submitAction"
                    id="linkAccount"
                    value="linkAccount"
                >
                    <component :is="props.i18n.msg('confirmLinkIdpContinue', idpAlias)" />
                </button>
            </div>
        </form>
    </component>
</template>
