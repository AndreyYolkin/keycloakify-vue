<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, client, logoutConfirm } = kcContext;
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
            <component :is="props.i18n.msg('logoutConfirmTitle')" />
        </template>

        <div id="kc-logout-confirm" class="content-area">
            <p class="instruction"><component :is="props.i18n.msg('logoutConfirmHeader')" /></p>
            <form class="form-actions" :action="url.logoutConfirmAction" method="POST">
                <input type="hidden" name="session_code" :value="logoutConfirm.code" />
                <div :class="kcClsx('kcFormGroupClass')">
                    <div id="kc-form-options">
                        <div :class="kcClsx('kcFormOptionsWrapperClass')"></div>
                    </div>
                    <div id="kc-form-buttons" :class="kcClsx('kcFormGroupClass')">
                        <input
                            :tabindex="4"
                            :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                            name="confirmLogout"
                            id="kc-logout"
                            type="submit"
                            :value="props.i18n.msgStr('doLogout')"
                        />
                    </div>
                </div>
            </form>
            <div id="kc-info-message">
                <p v-if="!logoutConfirm.skipLink && client.baseUrl">
                    <a :href="client.baseUrl"><component :is="props.i18n.msg('backToApplication')" /></a>
                </p>
            </div>
        </div>
    </component>
</template>
