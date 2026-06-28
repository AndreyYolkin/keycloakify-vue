<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { toRef } from "vue";
import LogoutOtherSessions from "../components/LogoutOtherSessions.vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";
import { useScript } from "./WebauthnRegister.useScript";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, isSetRetry, isAppInitiatedAction } = kcContext;

const authButtonId = "authenticateWebAuthnButton";

useScript({ authButtonId, kcContext, i18n: toRef(props, "i18n") });
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
      <span :class="kcClsx('kcWebAuthnKeyIcon')"></span>
      <component :is="props.i18n.msg('webauthn-registration-title')" />
    </template>

    <form
      id="register"
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <div :class="kcClsx('kcFormGroupClass')">
        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
        <input type="hidden" id="attestationObject" name="attestationObject" />
        <input
          type="hidden"
          id="publicKeyCredentialId"
          name="publicKeyCredentialId"
        />
        <input
          type="hidden"
          id="authenticatorLabel"
          name="authenticatorLabel"
        />
        <input type="hidden" id="transports" name="transports" />
        <input type="hidden" id="error" name="error" />
        <LogoutOtherSessions :kcClsx="kcClsx" :i18n="props.i18n" />
      </div>
    </form>
    <input
      type="submit"
      :class="
        kcClsx(
          'kcButtonClass',
          'kcButtonPrimaryClass',
          'kcButtonBlockClass',
          'kcButtonLargeClass',
        )
      "
      :id="authButtonId"
      :value="props.i18n.msgStr('doRegisterSecurityKey')"
    />
    <form
      v-if="!isSetRetry && isAppInitiatedAction"
      :action="url.loginAction"
      :class="kcClsx('kcFormClass')"
      id="kc-webauthn-settings-form"
      method="post"
    >
      <button
        type="submit"
        :class="
          kcClsx(
            'kcButtonClass',
            'kcButtonDefaultClass',
            'kcButtonBlockClass',
            'kcButtonLargeClass',
          )
        "
        id="cancelWebAuthnAIA"
        name="cancel-aia"
        value="true"
      >
        <component :is="props.i18n.msg('doCancel')" />
      </button>
    </form>
  </component>
</template>
