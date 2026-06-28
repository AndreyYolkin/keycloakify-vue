<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { computed } from "vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>>();

const kcContext = props.kcContext;
const {
  messageHeader,
  message,
  requiredActions,
  skipLink,
  pageRedirectUri,
  actionUri,
  client,
} = kcContext;

const headerHtml = computed(() =>
  kcSanitize(
    messageHeader ? props.i18n.advancedMsgStr(messageHeader) : message.summary,
  ),
);

const bodyHtml = computed(() => {
  let html = message.summary?.trim() ?? "";

  if (requiredActions) {
    html += " <b>";
    html += requiredActions
      .map((action) => props.i18n.advancedMsgStr(`requiredAction.${action}`))
      .join(", ");
    html += "</b>";
  }

  return kcSanitize(html);
});
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
      <span v-html="headerHtml" />
    </template>

    <div id="kc-info-message">
      <p class="instruction" v-html="bodyHtml" />
      <template v-if="!skipLink">
        <p v-if="pageRedirectUri">
          <a :href="pageRedirectUri"
            ><component :is="props.i18n.msg('backToApplication')"
          /></a>
        </p>
        <p v-else-if="actionUri">
          <a :href="actionUri"
            ><component :is="props.i18n.msg('proceedWithAction')"
          /></a>
        </p>
        <p v-else-if="client.baseUrl">
          <a :href="client.baseUrl"
            ><component :is="props.i18n.msg('backToApplication')"
          /></a>
        </p>
      </template>
    </div>
  </component>
</template>
