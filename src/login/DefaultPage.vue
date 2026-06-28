<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { computed, defineAsyncComponent, type Component } from "vue";
import DefaultUserProfileFormFields from "./components/UserProfileFormFields.vue";
import type { ClassKey } from "./TemplateProps";
import type { I18n } from "./i18n/i18n";
import NotImplemented from "./pages/NotImplemented.vue";

const Login = defineAsyncComponent(() => import("./pages/Login.vue"));
const Register = defineAsyncComponent(() => import("./pages/Register.vue"));
const Code = defineAsyncComponent(() => import("./pages/Code.vue"));
const DeleteAccountConfirm = defineAsyncComponent(() => import("./pages/DeleteAccountConfirm.vue"));
const DeleteCredential = defineAsyncComponent(() => import("./pages/DeleteCredential.vue"));
const Error = defineAsyncComponent(() => import("./pages/Error.vue"));
const FrontchannelLogout = defineAsyncComponent(() => import("./pages/FrontchannelLogout.vue"));
const IdpReviewUserProfile = defineAsyncComponent(() => import("./pages/IdpReviewUserProfile.vue"));
const Info = defineAsyncComponent(() => import("./pages/Info.vue"));
const LinkIdpAction = defineAsyncComponent(() => import("./pages/LinkIdpAction.vue"));
const LoginIdpLinkConfirm = defineAsyncComponent(() => import("./pages/LoginIdpLinkConfirm.vue"));
const LoginIdpLinkConfirmOverride = defineAsyncComponent(() => import("./pages/LoginIdpLinkConfirmOverride.vue"));
const LoginIdpLinkEmail = defineAsyncComponent(() => import("./pages/LoginIdpLinkEmail.vue"));
const LoginOauth2DeviceVerifyUserCode = defineAsyncComponent(() => import("./pages/LoginOauth2DeviceVerifyUserCode.vue"));
const LoginOauthGrant = defineAsyncComponent(() => import("./pages/LoginOauthGrant.vue"));
const LoginPageExpired = defineAsyncComponent(() => import("./pages/LoginPageExpired.vue"));
const LoginUpdateProfile = defineAsyncComponent(() => import("./pages/LoginUpdateProfile.vue"));
const LoginVerifyEmail = defineAsyncComponent(() => import("./pages/LoginVerifyEmail.vue"));
const LoginX509Info = defineAsyncComponent(() => import("./pages/LoginX509Info.vue"));
const LogoutConfirm = defineAsyncComponent(() => import("./pages/LogoutConfirm.vue"));
const SamlPostForm = defineAsyncComponent(() => import("./pages/SamlPostForm.vue"));
const SelectAuthenticator = defineAsyncComponent(() => import("./pages/SelectAuthenticator.vue"));
const SelectOrganization = defineAsyncComponent(() => import("./pages/SelectOrganization.vue"));
const Terms = defineAsyncComponent(() => import("./pages/Terms.vue"));
const UpdateEmail = defineAsyncComponent(() => import("./pages/UpdateEmail.vue"));
const LoginResetOtp = defineAsyncComponent(() => import("./pages/LoginResetOtp.vue"));
const LoginRecoveryAuthnCodeInput = defineAsyncComponent(() => import("./pages/LoginRecoveryAuthnCodeInput.vue"));
const LoginOtp = defineAsyncComponent(() => import("./pages/LoginOtp.vue"));
const LoginRecoveryAuthnCodeConfig = defineAsyncComponent(() => import("./pages/LoginRecoveryAuthnCodeConfig.vue"));
const LoginResetPassword = defineAsyncComponent(() => import("./pages/LoginResetPassword.vue"));
const LoginUpdatePassword = defineAsyncComponent(() => import("./pages/LoginUpdatePassword.vue"));
const LoginPassword = defineAsyncComponent(() => import("./pages/LoginPassword.vue"));
const LoginConfigTotp = defineAsyncComponent(() => import("./pages/LoginConfigTotp.vue"));
const LoginUsername = defineAsyncComponent(() => import("./pages/LoginUsername.vue"));
const WebauthnError = defineAsyncComponent(() => import("./pages/WebauthnError.vue"));
const WebauthnRegister = defineAsyncComponent(() => import("./pages/WebauthnRegister.vue"));
const WebauthnAuthenticate = defineAsyncComponent(() => import("./pages/WebauthnAuthenticate.vue"));
const LoginPasskeysConditionalAuthenticate = defineAsyncComponent(
    () => import("./pages/LoginPasskeysConditionalAuthenticate.vue")
);

const props = withDefaults(
    defineProps<{
        kcContext: KcContext;
        i18n: I18n;
        classes?: Partial<Record<ClassKey, string>>;
        Template: Component;
        UserProfileFormFields?: Component;
        doUseDefaultCss: boolean;
        doMakeUserConfirmPassword?: boolean;
    }>(),
    {
        classes: undefined,
        UserProfileFormFields: undefined,
        doMakeUserConfirmPassword: true
    }
);

const userProfileFormFields = computed<Component>(() => props.UserProfileFormFields ?? DefaultUserProfileFormFields);

const pageComponent = computed<Component>(() => {
    switch (props.kcContext.pageId) {
        case "login.ftl":
            return Login;
        case "register.ftl":
            return Register;
        case "code.ftl":
            return Code;
        case "delete-account-confirm.ftl":
            return DeleteAccountConfirm;
        case "delete-credential.ftl":
            return DeleteCredential;
        case "error.ftl":
            return Error;
        case "frontchannel-logout.ftl":
            return FrontchannelLogout;
        case "idp-review-user-profile.ftl":
            return IdpReviewUserProfile;
        case "info.ftl":
            return Info;
        case "link-idp-action.ftl":
            return LinkIdpAction;
        case "login-idp-link-confirm.ftl":
            return LoginIdpLinkConfirm;
        case "login-idp-link-confirm-override.ftl":
            return LoginIdpLinkConfirmOverride;
        case "login-idp-link-email.ftl":
            return LoginIdpLinkEmail;
        case "login-oauth2-device-verify-user-code.ftl":
            return LoginOauth2DeviceVerifyUserCode;
        case "login-oauth-grant.ftl":
            return LoginOauthGrant;
        case "login-page-expired.ftl":
            return LoginPageExpired;
        case "login-update-profile.ftl":
            return LoginUpdateProfile;
        case "login-verify-email.ftl":
            return LoginVerifyEmail;
        case "login-x509-info.ftl":
            return LoginX509Info;
        case "logout-confirm.ftl":
            return LogoutConfirm;
        case "saml-post-form.ftl":
            return SamlPostForm;
        case "select-authenticator.ftl":
            return SelectAuthenticator;
        case "select-organization.ftl":
            return SelectOrganization;
        case "terms.ftl":
            return Terms;
        case "update-email.ftl":
            return UpdateEmail;
        case "login-reset-otp.ftl":
            return LoginResetOtp;
        case "login-recovery-authn-code-input.ftl":
            return LoginRecoveryAuthnCodeInput;
        case "login-otp.ftl":
            return LoginOtp;
        case "login-recovery-authn-code-config.ftl":
            return LoginRecoveryAuthnCodeConfig;
        case "login-reset-password.ftl":
            return LoginResetPassword;
        case "login-update-password.ftl":
            return LoginUpdatePassword;
        case "login-password.ftl":
            return LoginPassword;
        case "login-config-totp.ftl":
            return LoginConfigTotp;
        case "login-username.ftl":
            return LoginUsername;
        case "webauthn-error.ftl":
            return WebauthnError;
        case "webauthn-register.ftl":
            return WebauthnRegister;
        case "webauthn-authenticate.ftl":
            return WebauthnAuthenticate;
        case "login-passkeys-conditional-authenticate.ftl":
            return LoginPasskeysConditionalAuthenticate;
        default:
            return NotImplemented;
    }
});
</script>

<template>
    <component
        :is="pageComponent"
        :kcContext="kcContext"
        :i18n="i18n"
        :classes="classes"
        :Template="Template"
        :UserProfileFormFields="userProfileFormFields"
        :doUseDefaultCss="doUseDefaultCss"
        :doMakeUserConfirmPassword="doMakeUserConfirmPassword"
        :pageId="kcContext.pageId"
    />
</template>
