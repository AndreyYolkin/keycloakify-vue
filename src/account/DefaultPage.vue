<script setup lang="ts">
import type { KcContext } from 'keycloakify/account/KcContext';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
import { computed, defineAsyncComponent, type Component } from 'vue';
import type { I18n } from './i18n/i18n';
import NotImplemented from './pages/NotImplemented.vue';

const Account = defineAsyncComponent(() => import('./pages/Account.vue'));
const Applications = defineAsyncComponent(() => import('./pages/Applications.vue'));
const FederatedIdentity = defineAsyncComponent(() => import('./pages/FederatedIdentity.vue'));
const Log = defineAsyncComponent(() => import('./pages/Log.vue'));
const Sessions = defineAsyncComponent(() => import('./pages/Sessions.vue'));

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
    case 'applications.ftl':
      return Applications;
    case 'federatedIdentity.ftl':
      return FederatedIdentity;
    case 'log.ftl':
      return Log;
    case 'sessions.ftl':
      return Sessions;
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
