<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { ref } from "vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { otpLogin, url, messagesPerField } = kcContext;

const isSubmitting = ref(false);

function onSubmit() {
    isSubmitting.value = true;
    return true;
}
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="!messagesPerField.existsError('totp')"
    >
        <template #header>
            <component :is="i18n.msg('doLogIn')" />
        </template>

        <form
            id="kc-otp-login-form"
            :class="kcClsx('kcFormClass')"
            :action="url.loginAction"
            method="post"
            @submit="onSubmit"
        >
            <div v-if="otpLogin.userOtpCredentials.length > 1" :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcInputWrapperClass')">
                    <template
                        v-for="(otpCredential, index) in otpLogin.userOtpCredentials"
                        :key="otpCredential.id"
                    >
                        <input
                            :id="`kc-otp-credential-${index}`"
                            :class="kcClsx('kcLoginOTPListInputClass')"
                            type="radio"
                            name="selectedCredentialId"
                            :value="otpCredential.id"
                            :checked="otpCredential.id === otpLogin.selectedCredentialId"
                        />
                        <label
                            :for="`kc-otp-credential-${index}`"
                            :class="kcClsx('kcLoginOTPListClass')"
                            :tabindex="index"
                        >
                            <span :class="kcClsx('kcLoginOTPListItemHeaderClass')">
                                <span :class="kcClsx('kcLoginOTPListItemIconBodyClass')">
                                    <i :class="kcClsx('kcLoginOTPListItemIconClass')" aria-hidden="true"></i>
                                </span>
                                <span :class="kcClsx('kcLoginOTPListItemTitleClass')">{{ otpCredential.userLabel }}</span>
                            </span>
                        </label>
                    </template>
                </div>
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcLabelWrapperClass')">
                    <label for="otp" :class="kcClsx('kcLabelClass')">
                        <component :is="i18n.msg('loginOtpOneTime')" />
                    </label>
                </div>
                <div :class="kcClsx('kcInputWrapperClass')">
                    <input
                        id="otp"
                        name="otp"
                        autocomplete="off"
                        type="text"
                        :class="kcClsx('kcInputClass')"
                        autofocus
                        :aria-invalid="messagesPerField.existsError('totp')"
                    />
                    <span
                        v-if="messagesPerField.existsError('totp')"
                        id="input-error-otp-code"
                        :class="kcClsx('kcInputErrorMessageClass')"
                        aria-live="polite"
                        v-html="kcSanitize(messagesPerField.get('totp'))"
                    ></span>
                </div>
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
                    <div :class="kcClsx('kcFormOptionsWrapperClass')"></div>
                </div>
                <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
                    <input
                        :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                        name="login"
                        id="kc-login"
                        type="submit"
                        :value="i18n.msgStr('doLogIn')"
                        :disabled="isSubmitting"
                    />
                </div>
            </div>
        </form>
    </component>
</template>
