<script setup lang="ts">
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { KcContext } from 'keycloakify/login/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n>>();

const kcContext = props.kcContext;
const { message, client, skipLink } = kcContext;
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
      <component :is="props.i18n.msg('errorTitle')" />
    </template>

    <div id="kc-error-message">
      <p
        class="instruction"
        v-html="kcSanitize(message.summary)"
      />
      <p v-if="!skipLink && !!client?.baseUrl">
        <a
          id="backToApplication"
          :href="client.baseUrl"
        >
          <component :is="props.i18n.msg('backToApplication')" />
        </a>
      </p>
    </div>
  </component>
</template>
