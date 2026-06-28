<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>
  >();

const kcContext = props.kcContext;
const { url } = kcContext;
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
      <component :is="props.i18n.msg('pageExpiredTitle')" />
    </template>

    <p id="instruction1" class="instruction">
      <component :is="props.i18n.msg('pageExpiredMsg1')" />
      <a id="loginRestartLink" :href="url.loginRestartFlowUrl">
        <component :is="props.i18n.msg('doClickHere')" />&nbsp; </a
      >&nbsp;.<br />
      <component :is="props.i18n.msg('pageExpiredMsg2')" />&nbsp;
      <a id="loginContinueLink" :href="url.loginAction">
        <component :is="props.i18n.msg('doClickHere')" /> </a
      >&nbsp;.
    </p>
  </component>
</template>
