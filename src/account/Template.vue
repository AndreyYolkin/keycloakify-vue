<script setup lang="ts">
import { onMounted } from 'vue';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { clsx } from 'keycloakify/tools/clsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import type { I18n } from './i18n/i18n';
import type { TemplateProps } from './TemplateProps';
import { useInitialize } from './Template.useInitialize';
import { useSetClassName } from '../tools/useSetClassName';

const props = defineProps<TemplateProps<KcContext, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const { url, features, realm, message, referrer } = props.kcContext;

onMounted(() => {
  document.title = props.i18n.msgStr('accountManagementTitle');
});

useSetClassName({
  qualifiedName: 'html',
  className: kcClsx('kcHtmlClass'),
});

useSetClassName({
  qualifiedName: 'body',
  className: clsx('admin-console', 'user', kcClsx('kcBodyClass')),
});

const { isReadyToRender } = useInitialize({
  kcContext: props.kcContext,
  doUseDefaultCss: props.doUseDefaultCss,
});
</script>

<template>
  <template v-if="isReadyToRender">
    <header class="navbar navbar-default navbar-pf navbar-main header">
      <nav
        class="navbar"
        role="navigation"
      >
        <div class="navbar-header">
          <div class="container">
            <h1 class="navbar-title">Keycloak</h1>
          </div>
        </div>
        <div class="navbar-collapse navbar-collapse-1">
          <div class="container">
            <ul class="nav navbar-nav navbar-utility">
              <li v-if="i18n.enabledLanguages.length > 1">
                <div
                  class="kc-dropdown"
                  id="kc-locale-dropdown"
                >
                  <a
                    href="#"
                    id="kc-current-locale-link"
                  >
                    {{ i18n.currentLanguage.label }}
                  </a>
                  <ul>
                    <li
                      v-for="enabledLanguage in i18n.enabledLanguages"
                      :key="enabledLanguage.languageTag"
                      class="kc-dropdown-item"
                    >
                      <a :href="enabledLanguage.href">{{ enabledLanguage.label }}</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li v-if="referrer?.url">
                <a
                  :href="referrer.url"
                  id="referrer"
                >
                  <component :is="i18n.msg('backTo', referrer.name)" />
                </a>
              </li>
              <li>
                <a :href="url.getLogoutUrl()">
                  <component :is="i18n.msg('doSignOut')" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <div class="bs-sidebar col-sm-3">
        <ul>
          <li :class="clsx(active === 'account' && 'active')">
            <a :href="url.accountUrl">
              <component :is="i18n.msg('account')" />
            </a>
          </li>
          <li
            v-if="features.passwordUpdateSupported"
            :class="clsx(active === 'password' && 'active')"
          >
            <a :href="url.passwordUrl">
              <component :is="i18n.msg('password')" />
            </a>
          </li>
          <li :class="clsx(active === 'totp' && 'active')">
            <a :href="url.totpUrl">
              <component :is="i18n.msg('authenticator')" />
            </a>
          </li>
          <li
            v-if="features.identityFederation"
            :class="clsx(active === 'social' && 'active')"
          >
            <a :href="url.socialUrl">
              <component :is="i18n.msg('federatedIdentity')" />
            </a>
          </li>
          <li :class="clsx(active === 'sessions' && 'active')">
            <a :href="url.sessionsUrl">
              <component :is="i18n.msg('sessions')" />
            </a>
          </li>
          <li :class="clsx(active === 'applications' && 'active')">
            <a :href="url.applicationsUrl">
              <component :is="i18n.msg('applications')" />
            </a>
          </li>
          <li
            v-if="features.log"
            :class="clsx(active === 'log' && 'active')"
          >
            <a :href="url.logUrl">
              <component :is="i18n.msg('log')" />
            </a>
          </li>
          <li
            v-if="realm.userManagedAccessAllowed && features.authorization"
            :class="clsx(active === 'authorization' && 'active')"
          >
            <a :href="url.resourceUrl">
              <component :is="i18n.msg('myResources')" />
            </a>
          </li>
        </ul>
      </div>

      <div class="col-sm-9 content-area">
        <div
          v-if="message !== undefined"
          :class="clsx('alert', `alert-${message.type}`)"
        >
          <span
            v-if="message.type === 'success'"
            class="pficon pficon-ok"
          ></span>
          <span
            v-else-if="message.type === 'error'"
            class="pficon pficon-error-circle-o"
          ></span>
          <span
            class="kc-feedback-text"
            v-html="kcSanitize(message.summary)"
          ></span>
        </div>

        <slot />
      </div>
    </div>
  </template>
</template>
