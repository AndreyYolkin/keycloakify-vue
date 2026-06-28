<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { ref, watch } from "vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>, I18n>
  >();

const kcContext = props.kcContext;
const { logout } = kcContext;

const iframeLoadCount = ref(0);

watch(iframeLoadCount, (count) => {
  if (!logout.logoutRedirectUri) {
    return;
  }

  if (count !== logout.clients.length) {
    return;
  }

  window.location.replace(logout.logoutRedirectUri);
});

function onIframeLoad() {
  iframeLoadCount.value++;
}
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :documentTitle="props.i18n.msgStr('frontchannel-logout.title')"
  >
    <template #header>
      <component :is="props.i18n.msg('frontchannel-logout.title')" />
    </template>

    <p><component :is="props.i18n.msg('frontchannel-logout.message')" /></p>
    <ul>
      <li v-for="client in logout.clients" :key="client.name">
        {{ client.name }}
        <iframe
          :src="client.frontChannelLogoutUrl"
          style="display: none"
          @load="onIframeLoad"
        />
      </li>
    </ul>
    <a
      v-if="logout.logoutRedirectUri !== undefined"
      id="continue"
      class="btn btn-primary"
      :href="logout.logoutRedirectUri"
    >
      <component :is="props.i18n.msg('doContinue')" />
    </a>
  </component>
</template>
