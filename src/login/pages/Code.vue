<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { code } = kcContext;
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
      <component v-if="code.success" :is="props.i18n.msg('codeSuccessTitle')" />
      <component v-else :is="props.i18n.msg('codeErrorTitle', code.error)" />
    </template>

    <div id="kc-code">
      <template v-if="code.success">
        <p><component :is="props.i18n.msg('copyCodeInstruction')" /></p>
        <input
          id="code"
          :class="kcClsx('kcTextareaClass')"
          :value="code.code"
        />
      </template>
      <p v-else-if="code.error" id="error" v-html="kcSanitize(code.error)" />
    </div>
  </component>
</template>
