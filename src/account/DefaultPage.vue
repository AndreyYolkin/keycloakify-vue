<script setup lang="ts">
import type { KcContext } from 'keycloakify/account/KcContext';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
import { computed, defineAsyncComponent, type Component } from 'vue';
import type { I18n } from './i18n/i18n';
import NotImplemented from './pages/NotImplemented.vue';

const Account = defineAsyncComponent(() => import('./pages/Account.vue'));

const props = defineProps<{
  kcContext: KcContext;
  i18n: I18n;
  classes?: Partial<Record<ClassKey, string>>;
  Template: Component;
  doUseDefaultCss: boolean;
}>();

const pageComponent = computed<Component>(() => {
  switch (props.kcContext.pageId) {
    case 'account.ftl':
      return Account;
    default:
      return NotImplemented;
  }
});
</script>

<template>
  <component
    :is="pageComponent"
    :kcContext="kcContext"
    :i18n="i18n"
    :classes="classes"
    :Template="Template"
    :doUseDefaultCss="doUseDefaultCss"
  />
</template>
