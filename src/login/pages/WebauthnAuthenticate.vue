<script setup lang="ts">
import type { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx, type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { clsx } from 'keycloakify/tools/clsx';
import type { CxArg } from 'keycloakify/tools/clsx_withTransform';
import { toRef } from 'vue';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';
import { useScript } from './WebauthnAuthenticate.useScript';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

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
    :displayInfo="realm.registrationAllowed && !registrationDisabled"
  >
    <template #header>
      <component :is="props.i18n.msg('webauthn-login-title')" />
    </template>

    <template #info>
      <div id="kc-registration">
        <span>
          <component :is="props.i18n.msg('noAccount')" />&nbsp;
          <a
            :tabindex="6"
            :href="url.registrationUrl"
          >
            <component :is="props.i18n.msg('doRegister')" />
          </a>
        </span>
      </div>
    </template>

    <div
      id="kc-form-webauthn"
      :class="kcClsx('kcFormClass')"
    >
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
      <div :class="clsx(kcClsx('kcFormGroupClass'), 'no-bottom-margin')">
        <template v-if="authenticators">
          <form
            id="authn_select"
            :class="kcClsx('kcFormClass')"
          >
            <input
              v-for="authenticator in authenticators.authenticators"
              :key="authenticator.credentialId"
              type="hidden"
              name="authn_use_chk"
              :value="authenticator.credentialId"
            />
          </form>

          <template v-if="shouldDisplayAuthenticators">
            <p
              v-if="authenticators.authenticators.length > 1"
              :class="kcClsx('kcSelectAuthListItemTitle')"
            >
              <component :is="props.i18n.msg('webauthn-available-authenticators')" />
            </p>
            <div :class="kcClsx('kcFormOptionsClass')">
              <div
                v-for="(authenticator, idx) in authenticators.authenticators"
                :key="authenticator.credentialId"
                :id="`kc-webauthn-authenticator-item-${idx}`"
                :class="kcClsx('kcSelectAuthListItemClass')"
              >
                <div :class="kcClsx('kcSelectAuthListItemIconClass')">
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
                </div>
                <div :class="kcClsx('kcSelectAuthListItemArrowIconClass')">
                  <div
                    :id="`kc-webauthn-authenticator-label-${idx}`"
                    :class="kcClsx('kcSelectAuthListItemHeadingClass')"
                  >
                    <component :is="props.i18n.advancedMsg(authenticator.label)" />
                  </div>
                  <div
                    v-if="authenticator.transports.displayNameProperties?.length"
                    :id="`kc-webauthn-authenticator-transport-${idx}`"
                    :class="kcClsx('kcSelectAuthListItemDescriptionClass')"
                  >
                    <template
                      v-for="(displayNameProperty, dpIdx) in authenticator.transports.displayNameProperties"
                      :key="displayNameProperty"
                    >
                      <component :is="props.i18n.advancedMsg(displayNameProperty)" />
                      <span v-if="dpIdx !== authenticator.transports.displayNameProperties!.length - 1">, </span>
                    </template>
                  </div>
                  <div :class="kcClsx('kcSelectAuthListItemDescriptionClass')">
                    <span :id="`kc-webauthn-authenticator-createdlabel-${idx}`">
                      <component :is="props.i18n.msg('webauthn-createdAt-label')" />
                    </span>
                    <span :id="`kc-webauthn-authenticator-created-${idx}`">{{ authenticator.createdAt }}</span>
                  </div>
                  <div :class="kcClsx('kcSelectAuthListItemFillClass')"></div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <div
          id="kc-form-buttons"
          :class="kcClsx('kcFormButtonsClass')"
        >
          <input
            :id="authButtonId"
            type="button"
            autofocus
            :value="props.i18n.msgStr('webauthn-doAuthenticate')"
            :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')"
          />
        </div>
      </div>
    </div>
  </component>
</template>
