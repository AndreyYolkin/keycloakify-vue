<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "delete-credential.ftl" }>, I18n>
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, credentialLabel } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayMessage="false"
  >
    <template #header>
      <component
        :is="props.i18n.msg('deleteCredentialTitle', credentialLabel)"
      />
    </template>

    <div id="kc-delete-text">
      <component
        :is="props.i18n.msg('deleteCredentialMessage', credentialLabel)"
      />
    </div>
    <form class="form-actions" :action="url.loginAction" method="POST">
      <input
        :class="
          kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')
        "
        name="accept"
        id="kc-accept"
        type="submit"
        :value="props.i18n.msgStr('doConfirmDelete')"
      />
      <input
        :class="
          kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')
        "
        name="cancel-aia"
        :value="props.i18n.msgStr('doCancel')"
        id="kc-decline"
        type="submit"
      />
    </form>
    <div class="clearfix" />
  </component>
</template>
