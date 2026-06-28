<script setup lang="ts">
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<any, I18n>>();
</script>

<template>
  <component
    :is="Template"
    :kcContext="props.kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active=""
  >
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Not implemented yet</h1>
      <p>
        Page <code>{{ props.kcContext.pageId }}</code> does not have a Vue implementation yet.
      </p>
    </div>
  </component>
</template>
