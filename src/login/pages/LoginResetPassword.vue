<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, realm, auth, messagesPerField } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayInfo="true"
    :displayMessage="!messagesPerField.existsError('username')"
  >
    <template #header>
      <component :is="i18n.msg('emailForgotTitle')" />
    </template>

    <template #info>
      <component
        v-if="realm.duplicateEmailsAllowed"
        :is="i18n.msg('emailInstructionUsername')"
      />
      <component v-else :is="i18n.msg('emailInstruction')" />
    </template>

    <form
      id="kc-reset-password-form"
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <div :class="kcClsx('kcFormGroupClass')">
        <div :class="kcClsx('kcLabelWrapperClass')">
          <label for="username" :class="kcClsx('kcLabelClass')">
            <component
              v-if="!realm.loginWithEmailAllowed"
              :is="i18n.msg('username')"
            />
            <component
              v-else-if="!realm.registrationEmailAsUsername"
              :is="i18n.msg('usernameOrEmail')"
            />
            <component v-else :is="i18n.msg('email')" />
          </label>
        </div>
        <div :class="kcClsx('kcInputWrapperClass')">
          <input
            type="text"
            id="username"
            name="username"
            :class="kcClsx('kcInputClass')"
            autofocus
            :value="auth.attemptedUsername ?? ''"
            :aria-invalid="messagesPerField.existsError('username')"
          />
          <span
            v-if="messagesPerField.existsError('username')"
            id="input-error-username"
            :class="kcClsx('kcInputErrorMessageClass')"
            aria-live="polite"
            v-html="kcSanitize(messagesPerField.get('username'))"
          ></span>
        </div>
      </div>
      <div :class="kcClsx('kcFormGroupClass', 'kcFormSettingClass')">
        <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
          <div :class="kcClsx('kcFormOptionsWrapperClass')">
            <span>
              <a :href="url.loginUrl"
                ><component :is="i18n.msg('backToLogin')"
              /></a>
            </span>
          </div>
        </div>

        <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
          <input
            :class="
              kcClsx(
                'kcButtonClass',
                'kcButtonPrimaryClass',
                'kcButtonBlockClass',
                'kcButtonLargeClass',
              )
            "
            type="submit"
            :value="i18n.msgStr('doSubmit')"
          />
        </div>
      </div>
    </form>
  </component>
</template>
