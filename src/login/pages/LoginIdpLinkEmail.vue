<script setup lang="ts">
import type { KcContext } from 'keycloakify/login/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'login-idp-link-email.ftl' }>, I18n>>();

const kcContext = props.kcContext;
const { url, realm, brokerContext, idpAlias } = kcContext;
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
      <component :is="props.i18n.msg('emailLinkIdpTitle', idpAlias)" />
    </template>

    <p
      id="instruction1"
      class="instruction"
    >
      <component :is="props.i18n.msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)" />
    </p>
    <p
      id="instruction2"
      class="instruction"
    >
      <component :is="props.i18n.msg('emailLinkIdp2')" />
      {{ ' ' }}
      <a :href="url.loginAction"><component :is="props.i18n.msg('doClickHere')" /></a>
      {{ ' ' }}
      <component :is="props.i18n.msg('emailLinkIdp3')" />
    </p>
    <p
      id="instruction3"
      class="instruction"
    >
      <component :is="props.i18n.msg('emailLinkIdp4')" />
      {{ ' ' }}
      <a :href="url.loginAction"><component :is="props.i18n.msg('doClickHere')" /></a>
      {{ ' ' }}
      <component :is="props.i18n.msg('emailLinkIdp5')" />
    </p>
  </component>
</template>
