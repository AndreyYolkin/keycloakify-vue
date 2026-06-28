<script setup lang="ts">
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'log.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { log } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active="log"
  >
    <div :class="kcClsx('kcContentWrapperClass')">
      <div class="col-md-10">
        <h2><component :is="props.i18n.msg('accountLogHtmlTitle')" /></h2>
      </div>
    </div>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <td><component :is="props.i18n.msg('date')" /></td>
          <td><component :is="props.i18n.msg('event')" /></td>
          <td><component :is="props.i18n.msg('ip')" /></td>
          <td><component :is="props.i18n.msg('client')" /></td>
          <td><component :is="props.i18n.msg('details')" /></td>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(event, index) in log.events"
          :key="index"
        >
          <td>{{ event.date ? new Date(event.date).toLocaleString() : '' }}</td>
          <td>{{ event.event }}</td>
          <td>{{ event.ipAddress }}</td>
          <td>{{ event.client || '' }}</td>
          <td>
            <span
              v-for="(detail, detailIndex) in event.details"
              :key="detailIndex"
              >{{ `${detail.key} = ${detail.value}` }}{{ detailIndex < event.details.length - 1 ? ', ' : '' }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </component>
</template>
