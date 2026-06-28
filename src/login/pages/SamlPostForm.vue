<script setup lang="ts">
import type { KcContext } from 'keycloakify/login/KcContext';
import { onMounted, useTemplateRef } from 'vue';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'saml-post-form.ftl' }>, I18n>>();

const kcContext = props.kcContext;
const { samlPost } = kcContext;

const formRef = useTemplateRef<HTMLFormElement>('formRef');

onMounted(() => {
  if (formRef.value === null) {
    return;
  }

  // Storybook
  if (samlPost.url === '#') {
    alert('In a real Keycloak the user would be redirected immediately');
    return;
  }

  formRef.value.requestSubmit();
});
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
      <component :is="props.i18n.msg('saml.post-form.title')" />
    </template>

    <p><component :is="props.i18n.msg('saml.post-form.message')" /></p>
    <form
      name="saml-post-binding"
      method="post"
      :action="samlPost.url"
      ref="formRef"
    >
      <input
        v-if="samlPost.SAMLRequest"
        type="hidden"
        name="SAMLRequest"
        :value="samlPost.SAMLRequest"
      />
      <input
        v-if="samlPost.SAMLResponse"
        type="hidden"
        name="SAMLResponse"
        :value="samlPost.SAMLResponse"
      />
      <input
        v-if="samlPost.relayState"
        type="hidden"
        name="RelayState"
        :value="samlPost.relayState"
      />
      <noscript>
        <p><component :is="props.i18n.msg('saml.post-form.js-disabled')" /></p>
        <input
          type="submit"
          :value="props.i18n.msgStr('doContinue')"
        />
      </noscript>
    </form>
  </component>
</template>
