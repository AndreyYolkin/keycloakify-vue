<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="!messagesPerField.existsError('recoveryCodeInput')"
    >
        <template #header>
            <component :is="i18n.msg('auth-recovery-code-header')" />
        </template>

        <form
            id="kc-recovery-code-login-form"
            :class="kcClsx('kcFormClass')"
            :action="url.loginAction"
            method="post"
        >
            <div :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcLabelWrapperClass')">
                    <label for="recoveryCodeInput" :class="kcClsx('kcLabelClass')">
                        <component :is="i18n.msg('auth-recovery-code-prompt', `${recoveryAuthnCodesInputBean.codeNumber}`)" />
                    </label>
                </div>
                <div :class="kcClsx('kcInputWrapperClass')">
                    <input
                        :tabindex="1"
                        id="recoveryCodeInput"
                        name="recoveryCodeInput"
                        :aria-invalid="messagesPerField.existsError('recoveryCodeInput')"
                        autocomplete="off"
                        type="text"
                        :class="kcClsx('kcInputClass')"
                        autofocus
                    />
                    <span
                        v-if="messagesPerField.existsError('recoveryCodeInput')"
                        id="input-error"
                        :class="kcClsx('kcInputErrorMessageClass')"
                        aria-live="polite"
                        v-html="kcSanitize(messagesPerField.get('recoveryCodeInput'))"
                    ></span>
                </div>
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <div id="kc-form-options" :class="kcClsx('kcFormOptionsWrapperClass')">
                    <div :class="kcClsx('kcFormOptionsWrapperClass')"></div>
                </div>
                <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
                    <input
                        :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                        name="login"
                        id="kc-login"
                        type="submit"
                        :value="i18n.msgStr('doLogIn')"
                    />
                </div>
            </div>
        </form>
    </component>
</template>
