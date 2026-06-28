<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { computed, ref, toRef } from "vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";
import { useScript } from "./LoginUsername.useScript";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const {
  social,
  realm,
  url,
  usernameHidden,
  login,
  registrationDisabled,
  messagesPerField,
  enableWebAuthnConditionalUI,
  authenticators,
} = kcContext;

const isLoginButtonDisabled = ref(false);

const usernameLabelKey = computed(() =>
  !realm.loginWithEmailAllowed
    ? "username"
    : !realm.registrationEmailAsUsername
      ? "usernameOrEmail"
      : "email",
);

function onSubmit() {
  isLoginButtonDisabled.value = true;
  return true;
}

const webAuthnButtonId = "authenticateWebAuthnButton";

useScript({
  webAuthnButtonId,
  kcContext,
  i18n: toRef(props, "i18n"),
});
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayMessage="!messagesPerField.existsError('username')"
    :displayInfo="
      realm.password && realm.registrationAllowed && !registrationDisabled
    "
  >
    <template #header>
      <component :is="i18n.msg('doLogIn')" />
    </template>

    <template #info>
      <div id="kc-registration">
        <span>
          <component :is="i18n.msg('noAccount')" />
          <a :tabindex="6" :href="url.registrationUrl">
            <component :is="i18n.msg('doRegister')" />
          </a>
        </span>
      </div>
    </template>

    <template #socialProviders>
      <div
        v-if="realm.password && social?.providers?.length"
        id="kc-social-providers"
        :class="kcClsx('kcFormSocialAccountSectionClass')"
      >
        <hr />
        <h2><component :is="i18n.msg('identity-provider-login-label')" /></h2>
        <ul
          :class="
            kcClsx(
              'kcFormSocialAccountListClass',
              social.providers.length > 3 && 'kcFormSocialAccountListGridClass',
            )
          "
        >
          <li v-for="p in social.providers" :key="p.providerId">
            <a
              :id="`social-${p.alias}`"
              :class="
                kcClsx(
                  'kcFormSocialAccountListButtonClass',
                  social.providers.length > 3 && 'kcFormSocialAccountGridItem',
                )
              "
              type="button"
              :href="p.loginUrl"
            >
              <i
                v-if="p.iconClasses"
                :class="clsx(kcClsx('kcCommonLogoIdP'), p.iconClasses)"
                aria-hidden="true"
              ></i>
              <span
                :class="
                  clsx(
                    kcClsx('kcFormSocialAccountNameClass'),
                    p.iconClasses && 'kc-social-icon-text',
                  )
                "
                v-html="kcSanitize(p.displayName)"
              ></span>
            </a>
          </li>
        </ul>
      </div>
    </template>

    <div id="kc-form">
      <div id="kc-form-wrapper">
        <form
          v-if="realm.password"
          id="kc-form-login"
          :action="url.loginAction"
          method="post"
          @submit="onSubmit"
        >
          <div v-if="!usernameHidden" :class="kcClsx('kcFormGroupClass')">
            <label for="username" :class="kcClsx('kcLabelClass')">
              <component :is="i18n.msg(usernameLabelKey)" />
            </label>
            <input
              :tabindex="2"
              id="username"
              :class="kcClsx('kcInputClass')"
              name="username"
              :value="login.username ?? ''"
              type="text"
              autofocus
              :autocomplete="
                enableWebAuthnConditionalUI ? 'username webauthn' : 'username'
              "
              :aria-invalid="messagesPerField.existsError('username')"
            />
            <span
              v-if="messagesPerField.existsError('username')"
              id="input-error"
              :class="kcClsx('kcInputErrorMessageClass')"
              aria-live="polite"
              v-html="kcSanitize(messagesPerField.getFirstError('username'))"
            ></span>
          </div>

          <div :class="kcClsx('kcFormGroupClass', 'kcFormSettingClass')">
            <div id="kc-form-options">
              <div v-if="realm.rememberMe && !usernameHidden" class="checkbox">
                <label>
                  <input
                    :tabindex="3"
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    :checked="!!login.rememberMe"
                  />
                  <component :is="i18n.msg('rememberMe')" />
                </label>
              </div>
            </div>
          </div>

          <div id="kc-form-buttons" :class="kcClsx('kcFormGroupClass')">
            <input
              :tabindex="4"
              :disabled="isLoginButtonDisabled"
              :class="
                kcClsx(
                  'kcButtonClass',
                  'kcButtonPrimaryClass',
                  'kcButtonBlockClass',
                  'kcButtonLargeClass',
                )
              "
              name="login"
              id="kc-login"
              type="submit"
              :value="i18n.msgStr('doLogIn')"
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

      <template
        v-if="
          authenticators !== undefined &&
          authenticators.authenticators.length !== 0
        "
      >
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
        :class="
          kcClsx(
            'kcButtonClass',
            'kcButtonDefaultClass',
            'kcButtonBlockClass',
            'kcButtonLargeClass',
          )
        "
        :value="i18n.msgStr('passkey-doAuthenticate')"
      />
    </template>
  </component>
</template>
