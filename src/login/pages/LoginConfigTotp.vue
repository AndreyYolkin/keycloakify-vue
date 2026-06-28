<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import LogoutOtherSessions from "../components/LogoutOtherSessions.vue";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="!messagesPerField.existsError('totp', 'userLabel')"
    >
        <template #header>
            <component :is="i18n.msg('loginTotpTitle')" />
        </template>

        <ol id="kc-totp-settings">
            <li>
                <p><component :is="i18n.msg('loginTotpStep1')" /></p>

                <ul id="kc-totp-supported-apps">
                    <li v-for="app in totp.supportedApplications" :key="app">
                        <component :is="i18n.advancedMsg(app)" />
                    </li>
                </ul>
            </li>

            <template v-if="mode === 'manual'">
                <li>
                    <p><component :is="i18n.msg('loginTotpManualStep2')" /></p>
                    <p>
                        <span id="kc-totp-secret-key">{{ totp.totpSecretEncoded }}</span>
                    </p>
                    <p>
                        <a :href="totp.qrUrl" id="mode-barcode">
                            <component :is="i18n.msg('loginTotpScanBarcode')" />
                        </a>
                    </p>
                </li>
                <li>
                    <p><component :is="i18n.msg('loginTotpManualStep3')" /></p>
                    <ul>
                        <li id="kc-totp-type">
                            <component :is="i18n.msg('loginTotpType')" />: <component :is="i18n.msg(`loginTotp.${totp.policy.type}`)" />
                        </li>
                        <li id="kc-totp-algorithm">
                            <component :is="i18n.msg('loginTotpAlgorithm')" />: {{ totp.policy.getAlgorithmKey() }}
                        </li>
                        <li id="kc-totp-digits">
                            <component :is="i18n.msg('loginTotpDigits')" />: {{ totp.policy.digits }}
                        </li>
                        <li v-if="totp.policy.type === 'totp'" id="kc-totp-period">
                            <component :is="i18n.msg('loginTotpInterval')" />: {{ totp.policy.period }}
                        </li>
                        <li v-else id="kc-totp-counter">
                            <component :is="i18n.msg('loginTotpCounter')" />: {{ totp.policy.initialCounter }}
                        </li>
                    </ul>
                </li>
            </template>

            <li v-else>
                <p><component :is="i18n.msg('loginTotpStep2')" /></p>
                <img
                    id="kc-totp-secret-qr-code"
                    :src="`data:image/png;base64, ${totp.totpSecretQrCode}`"
                    alt="Figure: Barcode"
                />
                <br />
                <p>
                    <a :href="totp.manualUrl" id="mode-manual">
                        <component :is="i18n.msg('loginTotpUnableToScan')" />
                    </a>
                </p>
            </li>

            <li>
                <p><component :is="i18n.msg('loginTotpStep3')" /></p>
                <p><component :is="i18n.msg('loginTotpStep3DeviceName')" /></p>
            </li>
        </ol>

        <form :action="url.loginAction" :class="kcClsx('kcFormClass')" id="kc-totp-settings-form" method="post">
            <div :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcInputWrapperClass')">
                    <label for="totp" :class="kcClsx('kcLabelClass')">
                        <component :is="i18n.msg('authenticatorCode')" />
                    </label>&nbsp;
                    <span class="required">*</span>
                </div>
                <div :class="kcClsx('kcInputWrapperClass')">
                    <input
                        type="text"
                        id="totp"
                        name="totp"
                        autocomplete="off"
                        :class="kcClsx('kcInputClass')"
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
                <input type="hidden" id="totpSecret" name="totpSecret" :value="totp.totpSecret" />
                <input v-if="mode" type="hidden" id="mode" :value="mode" />
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcInputWrapperClass')">
                    <label for="userLabel" :class="kcClsx('kcLabelClass')">
                        <component :is="i18n.msg('loginTotpDeviceName')" />
                    </label>&nbsp;
                    <span v-if="totp.otpCredentials.length >= 1" class="required">*</span>
                </div>
                <div :class="kcClsx('kcInputWrapperClass')">
                    <input
                        type="text"
                        id="userLabel"
                        name="userLabel"
                        autocomplete="off"
                        :class="kcClsx('kcInputClass')"
                        :aria-invalid="messagesPerField.existsError('userLabel')"
                    />
                    <span
                        v-if="messagesPerField.existsError('userLabel')"
                        id="input-error-otp-label"
                        :class="kcClsx('kcInputErrorMessageClass')"
                        aria-live="polite"
                        v-html="kcSanitize(messagesPerField.get('userLabel'))"
                    ></span>
                </div>
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <LogoutOtherSessions :kcClsx="kcClsx" :i18n="i18n" />
            </div>

            <template v-if="isAppInitiatedAction">
                <input
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                    id="saveTOTPBtn"
                    :value="i18n.msgStr('doSubmit')"
                />
                <button
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                    id="cancelTOTPBtn"
                    name="cancel-aia"
                    value="true"
                >
                    <component :is="i18n.msg('doCancel')" />
                </button>
            </template>
            <input
                v-else
                type="submit"
                :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                id="saveTOTPBtn"
                :value="i18n.msgStr('doSubmit')"
            />
        </form>
    </component>
</template>
