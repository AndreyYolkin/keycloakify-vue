<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { ref, toRef } from "vue";
import PasswordWrapper from "../components/PasswordWrapper.vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";
import { useScript } from "./LoginPassword.useScript";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { realm, url, messagesPerField, enableWebAuthnConditionalUI, authenticators } = kcContext;

const isLoginButtonDisabled = ref(false);

function onSubmit() {
    isLoginButtonDisabled.value = true;
    return true;
}

const webAuthnButtonId = "authenticateWebAuthnButton";

useScript({
    webAuthnButtonId,
    kcContext,
    i18n: toRef(props, "i18n")
});
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        :displayMessage="!messagesPerField.existsError('password')"
    >
        <template #header>
            <component :is="i18n.msg('doLogIn')" />
        </template>

        <div id="kc-form">
            <div id="kc-form-wrapper">
                <form
                    id="kc-form-login"
                    @submit="onSubmit"
                    :action="url.loginAction"
                    method="post"
                >
                    <div :class="clsx(kcClsx('kcFormGroupClass'), 'no-bottom-margin')">
                        <hr />
                        <label for="password" :class="kcClsx('kcLabelClass')">
                            <component :is="i18n.msg('password')" />
                        </label>

                        <PasswordWrapper :kcClsx="kcClsx" :i18n="i18n" passwordInputId="password">
                            <input
                                :tabindex="2"
                                id="password"
                                :class="kcClsx('kcInputClass')"
                                name="password"
                                type="password"
                                autofocus
                                autocomplete="on"
                                :aria-invalid="messagesPerField.existsError('username', 'password')"
                            />
                        </PasswordWrapper>

                        <span
                            v-if="messagesPerField.existsError('password')"
                            id="input-error-password"
                            :class="kcClsx('kcInputErrorMessageClass')"
                            aria-live="polite"
                            v-html="kcSanitize(messagesPerField.get('password'))"
                        ></span>
                    </div>

                    <div :class="kcClsx('kcFormGroupClass', 'kcFormSettingClass')">
                        <div id="kc-form-options">
                            <div :class="kcClsx('kcFormOptionsWrapperClass')">
                                <span v-if="realm.resetPasswordAllowed">
                                    <a :tabindex="5" :href="url.loginResetCredentialsUrl">
                                        <component :is="i18n.msg('doForgotPassword')" />
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div id="kc-form-buttons" :class="kcClsx('kcFormGroupClass')">
                        <input
                            :tabindex="4"
                            :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                            name="login"
                            id="kc-login"
                            type="submit"
                            :value="i18n.msgStr('doLogIn')"
                            :disabled="isLoginButtonDisabled"
                        />
                    </div>
                </form>
            </div>
        </div>

        <template v-if="enableWebAuthnConditionalUI">
            <form id="webauth" :action="url.loginAction" method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            <template v-if="authenticators !== undefined && authenticators.authenticators.length !== 0">
                <form id="authn_select" :class="kcClsx('kcFormClass')">
                    <input
                        v-for="(authenticator, i) in authenticators.authenticators"
                        :key="i"
                        type="hidden"
                        name="authn_use_chk"
                        :value="authenticator.credentialId"
                        readonly
                    />
                </form>
            </template>

            <br />

            <input
                :id="webAuthnButtonId"
                type="button"
                :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
                :value="i18n.msgStr('passkey-doAuthenticate')"
            />
        </template>
    </component>
</template>
