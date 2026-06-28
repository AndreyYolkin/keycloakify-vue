<script setup lang="ts">
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '../i18n/i18n';
import LogoutOtherSessions from '../components/LogoutOtherSessions.vue';
import PasswordWrapper from '../components/PasswordWrapper.vue';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'login-update-password.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, messagesPerField, isAppInitiatedAction } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayMessage="!messagesPerField.existsError('password', 'password-confirm')"
  >
    <template #header>
      <component :is="i18n.msg('updatePasswordTitle')" />
    </template>

    <form
      id="kc-passwd-update-form"
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <div :class="kcClsx('kcFormGroupClass')">
        <div :class="kcClsx('kcLabelWrapperClass')">
          <label
            for="password-new"
            :class="kcClsx('kcLabelClass')"
          >
            <component :is="i18n.msg('passwordNew')" />
          </label>
        </div>
        <div :class="kcClsx('kcInputWrapperClass')">
          <PasswordWrapper
            :kcClsx="kcClsx"
            :i18n="i18n"
            passwordInputId="password-new"
          >
            <input
              type="password"
              id="password-new"
              name="password-new"
              :class="kcClsx('kcInputClass')"
              autofocus
              autocomplete="new-password"
              :aria-invalid="messagesPerField.existsError('password', 'password-confirm')"
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
      </div>

      <div :class="kcClsx('kcFormGroupClass')">
        <div :class="kcClsx('kcLabelWrapperClass')">
          <label
            for="password-confirm"
            :class="kcClsx('kcLabelClass')"
          >
            <component :is="i18n.msg('passwordConfirm')" />
          </label>
        </div>
        <div :class="kcClsx('kcInputWrapperClass')">
          <PasswordWrapper
            :kcClsx="kcClsx"
            :i18n="i18n"
            passwordInputId="password-confirm"
          >
            <input
              type="password"
              id="password-confirm"
              name="password-confirm"
              :class="kcClsx('kcInputClass')"
              autocomplete="new-password"
              :aria-invalid="messagesPerField.existsError('password', 'password-confirm')"
            />
          </PasswordWrapper>

          <span
            v-if="messagesPerField.existsError('password-confirm')"
            id="input-error-password-confirm"
            :class="kcClsx('kcInputErrorMessageClass')"
            aria-live="polite"
            v-html="kcSanitize(messagesPerField.get('password-confirm'))"
          ></span>
        </div>
      </div>

      <div :class="kcClsx('kcFormGroupClass')">
        <LogoutOtherSessions
          :kcClsx="kcClsx"
          :i18n="i18n"
        />
        <div
          id="kc-form-buttons"
          :class="kcClsx('kcFormButtonsClass')"
        >
          <input
            :class="
              kcClsx(
                'kcButtonClass',
                'kcButtonPrimaryClass',
                !isAppInitiatedAction && 'kcButtonBlockClass',
                'kcButtonLargeClass',
              )
            "
            type="submit"
            :value="i18n.msgStr('doSubmit')"
          />
          <button
            v-if="isAppInitiatedAction"
            :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
            type="submit"
            name="cancel-aia"
            value="true"
          >
            <component :is="i18n.msg('doCancel')" />
          </button>
        </div>
      </div>
    </form>
  </component>
</template>
