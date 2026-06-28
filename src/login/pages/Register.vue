<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { computed, onMounted, onUnmounted, ref, useTemplateRef, type Component } from "vue";
import TermsAcceptance from "../components/TermsAcceptance.vue";
import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<
    PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
        UserProfileFormFields: Component<UserProfileFormFieldsProps>;
        doMakeUserConfirmPassword: boolean;
    }
>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired
} = kcContext;

const i18n = computed(() => props.i18n);

const isFormSubmittable = ref(false);
const areTermsAccepted = ref(false);

const formRef = useTemplateRef<HTMLFormElement>("formRef");

onMounted(() => {
    (window as any)["onSubmitRecaptcha"] = () => {
        formRef.value?.requestSubmit();
    };
});

onUnmounted(() => {
    delete (window as any)["onSubmitRecaptcha"];
});
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="messagesPerField.exists('global')"
        :displayRequiredFields="true"
    >
        <template #header>
            <component v-if="messageHeader !== undefined" :is="i18n.advancedMsg(messageHeader)" />
            <component v-else :is="i18n.msg('registerTitle')" />
        </template>

        <form id="kc-register-form" :class="kcClsx('kcFormClass')" :action="url.registrationAction" method="post" ref="formRef">
            <component
                :is="UserProfileFormFields"
                :kcContext="kcContext"
                :i18n="props.i18n"
                :kcClsx="kcClsx"
                :onIsFormSubmittableValueChange="(value: boolean) => (isFormSubmittable = value)"
                :doMakeUserConfirmPassword="doMakeUserConfirmPassword"
            />

            <TermsAcceptance
                v-if="termsAcceptanceRequired"
                :i18n="props.i18n"
                :kcClsx="kcClsx"
                :messagesPerField="messagesPerField"
                :areTermsAccepted="areTermsAccepted"
                :onAreTermsAcceptedValueChange="(value: boolean) => (areTermsAccepted = value)"
            />

            <div v-if="recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined)" class="form-group">
                <div :class="kcClsx('kcInputWrapperClass')">
                    <div class="g-recaptcha" data-size="compact" :data-sitekey="recaptchaSiteKey" :data-action="recaptchaAction"></div>
                </div>
            </div>

            <div :class="kcClsx('kcFormGroupClass')">
                <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
                    <div :class="kcClsx('kcFormOptionsWrapperClass')">
                        <span><a :href="url.loginUrl"><component :is="i18n.msg('backToLogin')" /></a></span>
                    </div>
                </div>

                <div
                    v-if="recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined"
                    id="kc-form-buttons"
                    :class="kcClsx('kcFormButtonsClass')"
                >
                    <button
                        :class="clsx(kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass'), 'g-recaptcha')"
                        :data-sitekey="recaptchaSiteKey"
                        data-callback="onSubmitRecaptcha"
                        :data-action="recaptchaAction"
                        type="submit"
                    >
                        <component :is="i18n.msg('doRegister')" />
                    </button>
                </div>
                <div v-else id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
                    <input
                        :disabled="!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)"
                        :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                        type="submit"
                        :value="i18n.msgStr('doRegister')"
                    />
                </div>
            </div>
        </form>
    </component>
</template>
