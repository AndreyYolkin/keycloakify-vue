<script setup lang="ts">
import { clsx } from "keycloakify/tools/clsx";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import LogoutOtherSessions from "../components/LogoutOtherSessions.vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";
import { useScript } from "./LoginRecoveryAuthnCodeConfig.useScript";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

const olRecoveryCodesListId = "kc-recovery-codes-list";

useScript({ olRecoveryCodesListId, i18n: props.i18n });
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
    >
        <template #header>
            <component :is="i18n.msg('recovery-code-config-header')" />
        </template>

        <div
            :class="clsx('pf-c-alert', 'pf-m-warning', 'pf-m-inline', kcClsx('kcRecoveryCodesWarning'))"
            aria-label="Warning alert"
        >
            <div class="pf-c-alert__icon">
                <i class="pficon-warning-triangle-o" aria-hidden="true"></i>
            </div>
            <h4 class="pf-c-alert__title">
                <span class="pf-screen-reader">Warning alert:</span>
                <component :is="i18n.msg('recovery-code-config-warning-title')" />
            </h4>
            <div class="pf-c-alert__description">
                <p><component :is="i18n.msg('recovery-code-config-warning-message')" /></p>
            </div>
        </div>

        <ol :id="olRecoveryCodesListId" :class="kcClsx('kcRecoveryCodesList')">
            <li v-for="(code, index) in recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList" :key="code">
                <span>{{ index + 1 }}:</span> {{ code.slice(0, 4) }}-{{ code.slice(4, 8) }}-{{ code.slice(8) }}
            </li>
        </ol>

        <!-- actions -->
        <div :class="kcClsx('kcRecoveryCodesActions')">
            <button id="printRecoveryCodes" :class="clsx('pf-c-button', 'pf-m-link')" type="button">
                <i class="pficon-print" aria-hidden="true"></i>
                <component :is="i18n.msg('recovery-codes-print')" />
            </button>
            <button id="downloadRecoveryCodes" :class="clsx('pf-c-button', 'pf-m-link')" type="button">
                <i class="pficon-save" aria-hidden="true"></i>
                <component :is="i18n.msg('recovery-codes-download')" />
            </button>
            <button id="copyRecoveryCodes" :class="clsx('pf-c-button', 'pf-m-link')" type="button">
                <i class="pficon-blueprint" aria-hidden="true"></i>
                <component :is="i18n.msg('recovery-codes-copy')" />
            </button>
        </div>

        <!-- confirmation checkbox -->
        <div :class="kcClsx('kcFormOptionsClass')">
            <input
                :class="kcClsx('kcCheckInputClass')"
                type="checkbox"
                id="kcRecoveryCodesConfirmationCheck"
                name="kcRecoveryCodesConfirmationCheck"
                @change="(event) => {
                    // @ts-expect-error: This is inherited from the original code
                    document.getElementById('saveRecoveryAuthnCodesBtn').disabled = !(event.target as HTMLInputElement).checked;
                }"
            />
            <label for="kcRecoveryCodesConfirmationCheck">
                <component :is="i18n.msg('recovery-codes-confirmation-message')" />
            </label>
        </div>

        <form
            :action="kcContext.url.loginAction"
            :class="kcClsx('kcFormGroupClass')"
            id="kc-recovery-codes-settings-form"
            method="post"
        >
            <input type="hidden" name="generatedRecoveryAuthnCodes" :value="recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString" />
            <input type="hidden" name="generatedAt" :value="recoveryAuthnCodesConfigBean.generatedAt" />
            <input type="hidden" id="userLabel" name="userLabel" :value="i18n.msgStr('recovery-codes-label-default')" />

            <LogoutOtherSessions :kcClsx="kcClsx" :i18n="i18n" />

            <template v-if="isAppInitiatedAction">
                <input
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                    id="saveRecoveryAuthnCodesBtn"
                    :value="i18n.msgStr('recovery-codes-action-complete')"
                    disabled
                />
                <button
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                    id="cancelRecoveryAuthnCodesBtn"
                    name="cancel-aia"
                    value="true"
                >
                    <component :is="i18n.msg('recovery-codes-action-cancel')" />
                </button>
            </template>
            <template v-else>
                <input
                    type="submit"
                    :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                    id="saveRecoveryAuthnCodesBtn"
                    :value="i18n.msgStr('recovery-codes-action-complete')"
                    disabled
                />
            </template>
        </form>
    </component>
</template>
