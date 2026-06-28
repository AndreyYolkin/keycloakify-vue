<script setup lang="ts">
import type { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'link-idp-action.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { idpDisplayName, url } = kcContext;
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
      <component :is="props.i18n.msg('linkIdpActionTitle', idpDisplayName)" />
    </template>

    <div
      id="kc-link-text"
      :class="kcClsx('kcContentWrapperClass')"
    >
      <component :is="props.i18n.msg('linkIdpActionMessage', idpDisplayName)" />
    </div>
    <form
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <div :class="kcClsx('kcFormGroupClass')">
        <div
          id="kc-form-buttons"
          :class="kcClsx('kcFormButtonsClass')"
        >
          <input
            :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
            name="continue"
            id="kc-continue"
            type="submit"
            :value="props.i18n.msgStr('doContinue')"
          />
          <input
            :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
            name="cancel-aia"
            id="kc-cancel"
            type="submit"
            :value="props.i18n.msgStr('doCancel')"
          />
        </div>
      </div>
    </form>
    <div class="clearfix" />
  </component>
</template>
