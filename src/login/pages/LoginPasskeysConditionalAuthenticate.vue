<script setup lang="ts">
import type { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx, type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { clsx } from 'keycloakify/tools/clsx';
import type { CxArg } from 'keycloakify/tools/clsx_withTransform';
import { toRef } from 'vue';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';
import { useScript } from './LoginPasskeysConditionalAuthenticate.useScript';

const props =
  defineProps<PageProps<Extract<KcContext, { pageId: 'login-passkeys-conditional-authenticate.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const {
  messagesPerField,
  login,
  url,
  usernameHidden,
  shouldDisplayAuthenticators,
  authenticators,
  registrationDisabled,
  realm,
} = kcContext;

const authButtonId = 'authenticateWebAuthnButton';

useScript({ authButtonId, kcContext, i18n: toRef(props, 'i18n') });
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
  >
    <template #header>
      <component :is="props.i18n.msg('passkey-login-title')" />
    </template>

    <template #info>
      <div
        v-if="realm.registrationAllowed && !registrationDisabled"
        id="kc-registration"
      >
        <span>
          <component :is="props.i18n.msg('noAccount')" />
          <a
            :tabindex="6"
            :href="url.registrationUrl"
          >
            <component :is="props.i18n.msg('doRegister')" />
          </a>
        </span>
      </div>
    </template>

    <form
      id="webauth"
      :action="url.loginAction"
      method="post"
    >
      <input
        type="hidden"
        id="clientDataJSON"
        name="clientDataJSON"
      />
      <input
        type="hidden"
        id="authenticatorData"
        name="authenticatorData"
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
      />
      <input
        type="hidden"
        id="credentialId"
        name="credentialId"
      />
      <input
        type="hidden"
        id="userHandle"
        name="userHandle"
      />
      <input
        type="hidden"
        id="error"
        name="error"
      />
    </form>

    <div
      :class="kcClsx('kcFormGroupClass')"
      no-bottom-margin="true"
      :style="{ marginBottom: 0 }"
    >
      <template v-if="authenticators !== undefined && Object.keys(authenticators).length !== 0">
        <form
          id="authn_select"
          :class="kcClsx('kcFormClass')"
        >
          <input
            v-for="authenticator in authenticators.authenticators"
            :key="authenticator.credentialId"
            type="hidden"
            name="authn_use_chk"
            readonly
            :value="authenticator.credentialId"
          />
        </form>
        <template v-if="shouldDisplayAuthenticators">
          <p
            v-if="authenticators.authenticators.length > 1"
            :class="kcClsx('kcSelectAuthListItemTitle')"
          >
            <component :is="props.i18n.msg('passkey-available-authenticators')" />
          </p>
          <div :class="kcClsx('kcFormClass')">
            <div
              v-for="(authenticator, idx) in authenticators.authenticators"
              :key="authenticator.credentialId"
              :id="`kc-webauthn-authenticator-item-${idx}`"
              :class="kcClsx('kcSelectAuthListItemClass')"
            >
              <i
                :class="
                  clsx(
                    (() => {
                      const klass = kcClsx(authenticator.transports.iconClass as CxArg<ClassKey>);
                      if (klass === authenticator.transports.iconClass) {
                        return kcClsx('kcWebAuthnDefaultIcon');
                      }
                      return klass;
                    })(),
                    kcClsx('kcSelectAuthListItemIconPropertyClass'),
                  )
                "
              ></i>
              <div :class="kcClsx('kcSelectAuthListItemBodyClass')">
                <div
                  :id="`kc-webauthn-authenticator-label-${idx}`"
                  :class="kcClsx('kcSelectAuthListItemHeadingClass')"
                >
                  <component :is="props.i18n.advancedMsg(authenticator.label)" />
                </div>
                <div
                  v-if="
                    authenticator.transports !== undefined &&
                    authenticator.transports.displayNameProperties !== undefined &&
                    authenticator.transports.displayNameProperties.length !== 0
                  "
                  :id="`kc-webauthn-authenticator-transport-${idx}`"
                  :class="kcClsx('kcSelectAuthListItemDescriptionClass')"
                >
                  <template
                    v-for="(nameProperty, dpIdx) in authenticator.transports.displayNameProperties"
                    :key="nameProperty"
                  >
                    <span>
                      <component :is="props.i18n.advancedMsg(nameProperty)" />
                    </span>
                    <span v-if="dpIdx !== authenticator.transports.displayNameProperties!.length - 1">, </span>
                  </template>
                </div>
                <div :class="kcClsx('kcSelectAuthListItemDescriptionClass')">
                  <span :id="`kc-webauthn-authenticator-createdlabel-${idx}`">
                    <component :is="props.i18n.msg('passkey-createdAt-label')" />
                  </span>
                  <span :id="`kc-webauthn-authenticator-created-${idx}`">{{ authenticator.createdAt }}</span>
                </div>
              </div>
              <div :class="kcClsx('kcSelectAuthListItemFillClass')"></div>
            </div>
          </div>
        </template>
      </template>

      <div id="kc-form">
        <div id="kc-form-wrapper">
          <form
            v-if="realm.password"
            id="kc-form-login"
            :action="url.loginAction"
            method="post"
            style="display: none"
            @submit="
              (event) => {
                try {
                  // @ts-expect-error: Trusted Keycloak's code
                  event.target.login.disabled = true;
                } catch {}
                return true;
              }
            "
          >
            <div
              v-if="!usernameHidden"
              :class="kcClsx('kcFormGroupClass')"
            >
              <label
                for="username"
                :class="kcClsx('kcLabelClass')"
              >
                <component :is="props.i18n.msg('passkey-autofill-select')" />
              </label>
              <input
                :tabindex="1"
                id="username"
                :aria-invalid="messagesPerField.existsError('username')"
                :class="kcClsx('kcInputClass')"
                name="username"
                :value="login.username ?? ''"
                autocomplete="username webauthn"
                type="text"
                autofocus
              />
              <span
                v-if="messagesPerField.existsError('username')"
                id="input-error-username"
                :class="kcClsx('kcInputErrorMessageClass')"
                aria-live="polite"
              >
                {{ messagesPerField.get('username') }}
              </span>
            </div>
          </form>

          <div
            id="kc-form-passkey-button"
            :class="kcClsx('kcFormButtonsClass')"
            style="display: none"
          >
            <input
              :id="authButtonId"
              type="button"
              autofocus
              :value="props.i18n.msgStr('passkey-doAuthenticate')"
              :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
            />
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
