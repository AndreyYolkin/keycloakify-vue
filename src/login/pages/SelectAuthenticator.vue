<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, auth } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayInfo="false"
    >
        <template #header>
            <component :is="i18n.msg('loginChooseAuthenticator')" />
        </template>

        <form id="kc-select-credential-form" :class="kcClsx('kcFormClass')" :action="url.loginAction" method="post">
            <div :class="kcClsx('kcSelectAuthListClass')">
                <button
                    v-for="(authenticationSelection, i) in auth.authenticationSelections"
                    :key="i"
                    :class="kcClsx('kcSelectAuthListItemClass')"
                    type="submit"
                    name="authenticationExecution"
                    :value="authenticationSelection.authExecId"
                >
                    <div :class="kcClsx('kcSelectAuthListItemIconClass')">
                        <i :class="kcClsx('kcSelectAuthListItemIconPropertyClass', authenticationSelection.iconCssClass)"></i>
                    </div>
                    <div :class="kcClsx('kcSelectAuthListItemBodyClass')">
                        <div :class="kcClsx('kcSelectAuthListItemHeadingClass')">
                            <component :is="i18n.advancedMsg(authenticationSelection.displayName)" />
                        </div>
                        <div :class="kcClsx('kcSelectAuthListItemDescriptionClass')">
                            <component :is="i18n.advancedMsg(authenticationSelection.helpText)" />
                        </div>
                    </div>
                    <div :class="kcClsx('kcSelectAuthListItemFillClass')"></div>
                    <div :class="kcClsx('kcSelectAuthListItemArrowClass')">
                        <i :class="kcClsx('kcSelectAuthListItemArrowIconClass')"></i>
                    </div>
                </button>
            </div>
        </form>
    </component>
</template>
