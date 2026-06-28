<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, isAppInitiatedAction, execution } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayMessage="true"
  >
    <template #header>
      <component :is="i18n.msg('webauthn-error-title')" />
    </template>

    <form
      id="kc-error-credential-form"
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <input type="hidden" id="executionValue" name="authenticationExecution" />
      <input type="hidden" id="isSetRetry" name="isSetRetry" />
    </form>
    <input
      :tabindex="4"
      @click="
        () => {
          // @ts-expect-error: Trusted Keycloak's code
          document.getElementById('isSetRetry').value = 'retry';
          // @ts-expect-error: Trusted Keycloak's code
          document.getElementById('executionValue').value = execution;
          // @ts-expect-error: Trusted Keycloak's code
          document.getElementById('kc-error-credential-form').requestSubmit();
        }
      "
      type="button"
      :class="
        kcClsx(
          'kcButtonClass',
          'kcButtonPrimaryClass',
          'kcButtonBlockClass',
          'kcButtonLargeClass',
        )
      "
      name="try-again"
      id="kc-try-again"
      :value="i18n.msgStr('doTryAgain')"
    />
    <form
      v-if="isAppInitiatedAction"
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
        {{ i18n.msgStr("doCancel") }}
      </button>
    </form>
  </component>
</template>
