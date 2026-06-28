<script setup lang="ts">
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { clsx } from 'keycloakify/tools/clsx';
import { computed, ref } from 'vue';
import PasswordWrapper from '../components/PasswordWrapper.vue';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

const isLoginButtonDisabled = ref(false);

const usernameLabelKey = computed(() =>
  !realm.loginWithEmailAllowed ? 'username' : !realm.registrationEmailAsUsername ? 'usernameOrEmail' : 'email',
);

function onSubmit() {
  isLoginButtonDisabled.value = true;
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
    :displayMessage="!messagesPerField.existsError('username', 'password')"
    :displayInfo="realm.password && realm.registrationAllowed && !registrationDisabled"
  >
    <template #header>
      <component :is="i18n.msg('loginAccountTitle')" />
    </template>

    <template #info>
      <div id="kc-registration-container">
        <div id="kc-registration">
          <span>
            <component :is="i18n.msg('noAccount')" />&nbsp;
            <a
              :tabindex="8"
              :href="url.registrationUrl"
            >
              <component :is="i18n.msg('doRegister')" />
            </a>
          </span>
        </div>
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
            kcClsx('kcFormSocialAccountListClass', social.providers.length > 3 && 'kcFormSocialAccountListGridClass')
          "
        >
          <li
            v-for="p in social.providers"
            :key="p.providerId"
          >
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
                :class="clsx(kcClsx('kcFormSocialAccountNameClass'), p.iconClasses && 'kc-social-icon-text')"
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
          <div
            v-if="!usernameHidden"
            :class="kcClsx('kcFormGroupClass')"
          >
            <label
              for="username"
              :class="kcClsx('kcLabelClass')"
            >
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
              autocomplete="username"
              :aria-invalid="messagesPerField.existsError('username', 'password')"
            />
            <span
              v-if="messagesPerField.existsError('username', 'password')"
              id="input-error"
              :class="kcClsx('kcInputErrorMessageClass')"
              aria-live="polite"
              v-html="kcSanitize(messagesPerField.getFirstError('username', 'password'))"
            ></span>
          </div>

          <div :class="kcClsx('kcFormGroupClass')">
            <label
              for="password"
              :class="kcClsx('kcLabelClass')"
            >
              <component :is="i18n.msg('password')" />
            </label>
            <PasswordWrapper
              :kcClsx="kcClsx"
              :i18n="i18n"
              passwordInputId="password"
            >
              <input
                :tabindex="3"
                id="password"
                :class="kcClsx('kcInputClass')"
                name="password"
                type="password"
                autocomplete="current-password"
                :aria-invalid="messagesPerField.existsError('username', 'password')"
              />
            </PasswordWrapper>
            <span
              v-if="usernameHidden && messagesPerField.existsError('username', 'password')"
              id="input-error"
              :class="kcClsx('kcInputErrorMessageClass')"
              aria-live="polite"
              v-html="kcSanitize(messagesPerField.getFirstError('username', 'password'))"
            ></span>
          </div>

          <div :class="kcClsx('kcFormGroupClass', 'kcFormSettingClass')">
            <div id="kc-form-options">
              <div
                v-if="realm.rememberMe && !usernameHidden"
                class="checkbox"
              >
                <label>
                  <input
                    :tabindex="5"
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    :checked="!!login.rememberMe"
                  />
                  <component :is="i18n.msg('rememberMe')" />
                </label>
              </div>
            </div>
            <div :class="kcClsx('kcFormOptionsWrapperClass')">
              <span v-if="realm.resetPasswordAllowed">
                <a
                  :tabindex="6"
                  :href="url.loginResetCredentialsUrl"
                >
                  <component :is="i18n.msg('doForgotPassword')" />
                </a>
              </span>
            </div>
          </div>

          <div
            id="kc-form-buttons"
            :class="kcClsx('kcFormGroupClass')"
          >
            <input
              type="hidden"
              id="id-hidden-input"
              name="credentialId"
              :value="auth.selectedCredential"
            />
            <input
              :tabindex="7"
              :disabled="isLoginButtonDisabled"
              :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
              name="login"
              id="kc-login"
              type="submit"
              :value="i18n.msgStr('doLogIn')"
            />
          </div>
        </form>
      </div>
    </div>
  </component>
</template>
