<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, messagesPerField, configuredOtpCredentials } = kcContext;
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

        <form id="kc-otp-reset-form" :class="kcClsx('kcFormClass')" :action="url.loginAction" method="post">
            <div :class="kcClsx('kcInputWrapperClass')">
                <div :class="kcClsx('kcInfoAreaWrapperClass')">
                    <p id="kc-otp-reset-form-description">
                        <component :is="i18n.msg('otp-reset-description')" />
                    </p>
                    <template
                        v-for="(otpCredential, index) in configuredOtpCredentials.userOtpCredentials"
                        :key="otpCredential.id"
                    >
                        <input
                            :id="`kc-otp-credential-${index}`"
                            :class="kcClsx('kcLoginOTPListInputClass')"
                            type="radio"
                            name="selectedCredentialId"
                            :value="otpCredential.id"
                            :checked="otpCredential.id === configuredOtpCredentials.selectedCredentialId"
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
                    <div :class="kcClsx('kcFormGroupClass')">
                        <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
                            <input
                                id="kc-otp-reset-form-submit"
                                :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                                type="submit"
                                :value="i18n.msgStr('doSubmit')"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="clearfix" />
    </component>
</template>
