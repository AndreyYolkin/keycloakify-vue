<script setup lang="ts">
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'sessions.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, stateChecker, sessions } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active="sessions"
  >
    <div :class="kcClsx('kcContentWrapperClass')">
      <div class="col-md-10">
        <h2><component :is="props.i18n.msg('sessionsHtmlTitle')" /></h2>
      </div>
    </div>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th><component :is="props.i18n.msg('ip')" /></th>
          <th><component :is="props.i18n.msg('started')" /></th>
          <th><component :is="props.i18n.msg('lastAccess')" /></th>
          <th><component :is="props.i18n.msg('expires')" /></th>
          <th><component :is="props.i18n.msg('clients')" /></th>
        </tr>
      </thead>

      <tbody role="rowgroup">
        <tr
          v-for="(session, index) in sessions.sessions"
          :key="index"
        >
          <td>{{ session.ipAddress }}</td>
          <td>{{ session.started }}</td>
          <td>{{ session.lastAccess }}</td>
          <td>{{ session.expires }}</td>
          <td>
            <div
              v-for="(client, clientIndex) in session.clients"
              :key="clientIndex"
            >
              {{ client }}<br />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <form
      :action="url.sessionsUrl"
      method="post"
    >
      <input
        type="hidden"
        id="stateChecker"
        name="stateChecker"
        :value="stateChecker"
      />
      <button
        id="logout-all-sessions"
        type="submit"
        :class="kcClsx('kcButtonDefaultClass', 'kcButtonClass')"
      >
        <component :is="props.i18n.msg('doLogOutAllSessions')" />
      </button>
    </form>
  </component>
</template>
