<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<
      Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>,
      I18n
    >
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, triggered_from_aia } = kcContext;
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
      <component :is="props.i18n.msg('deleteAccountConfirm')" />
    </template>

    <form :action="url.loginAction" class="form-vertical" method="post">
      <div
        class="alert alert-warning"
        style="margin-top: 0; margin-bottom: 30px"
      >
        <span class="pficon pficon-warning-triangle-o"></span>
        <component :is="props.i18n.msg('irreversibleAction')" />
      </div>
      <p><component :is="props.i18n.msg('deletingImplies')" /></p>
      <ul style="color: #72767b; list-style: disc; list-style-position: inside">
        <li><component :is="props.i18n.msg('loggingOutImmediately')" /></li>
        <li><component :is="props.i18n.msg('errasingData')" /></li>
      </ul>
      <p class="delete-account-text">
        <component :is="props.i18n.msg('finalDeletionConfirmation')" />
      </p>
      <div id="kc-form-buttons">
        <input
          :class="
            kcClsx(
              'kcButtonClass',
              'kcButtonPrimaryClass',
              'kcButtonLargeClass',
            )
          "
          type="submit"
          :value="props.i18n.msgStr('doConfirmDelete')"
        />
        <button
          v-if="triggered_from_aia"
          :class="
            kcClsx(
              'kcButtonClass',
              'kcButtonDefaultClass',
              'kcButtonLargeClass',
            )
          "
          style="margin-left: calc(100% - 220px)"
          type="submit"
          name="cancel-aia"
          value="true"
        >
          {{ props.i18n.msgStr("doCancel") }}
        </button>
      </div>
    </form>
  </component>
</template>
