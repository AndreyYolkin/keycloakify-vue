<script setup lang="ts">
import { clsx } from 'keycloakify/tools/clsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'account.ftl' }>, I18n>>();

const classes = {
  ...props.classes,
  kcBodyClass: clsx(props.classes?.kcBodyClass, 'user'),
};

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes,
});

const kcContext = props.kcContext;
const { url, realm, messagesPerField, stateChecker, account, referrer } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="classes"
    active="account"
  >
    <div class="row">
      <div class="col-md-10">
        <h2><component :is="props.i18n.msg('editAccountHtmlTitle')" /></h2>
      </div>
      <div class="col-md-2 subtitle">
        <span class="subtitle">
          <span class="required">*</span>
          <component :is="props.i18n.msg('requiredFields')" />
        </span>
      </div>
    </div>

    <form
      :action="url.accountUrl"
      class="form-horizontal"
      method="post"
    >
      <input
        type="hidden"
        id="stateChecker"
        name="stateChecker"
        :value="stateChecker"
      />

      <template v-if="!realm.registrationEmailAsUsername">
        <div :class="clsx('form-group', messagesPerField.printIfExists('username', 'has-error'))">
          <div class="col-sm-2 col-md-2">
            <label
              for="username"
              class="control-label"
            >
              <component :is="props.i18n.msg('username')" />
            </label>
            <span
              v-if="realm.editUsernameAllowed"
              class="required"
            >*</span>
          </div>
          <div class="col-sm-10 col-md-10">
            <input
              type="text"
              class="form-control"
              id="username"
              name="username"
              :disabled="!realm.editUsernameAllowed"
              :value="account.username ?? ''"
            />
          </div>
        </div>
      </template>

      <div :class="clsx('form-group', messagesPerField.printIfExists('email', 'has-error'))">
        <div class="col-sm-2 col-md-2">
          <label
            for="email"
            class="control-label"
          >
            <component :is="props.i18n.msg('email')" />
          </label>
          <span class="required">*</span>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="text"
            class="form-control"
            id="email"
            name="email"
            autofocus
            :value="account.email ?? ''"
          />
        </div>
      </div>

      <div :class="clsx('form-group', messagesPerField.printIfExists('firstName', 'has-error'))">
        <div class="col-sm-2 col-md-2">
          <label
            for="firstName"
            class="control-label"
          >
            <component :is="props.i18n.msg('firstName')" />
          </label>
          <span class="required">*</span>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="text"
            class="form-control"
            id="firstName"
            name="firstName"
            :value="account.firstName ?? ''"
          />
        </div>
      </div>

      <div :class="clsx('form-group', messagesPerField.printIfExists('lastName', 'has-error'))">
        <div class="col-sm-2 col-md-2">
          <label
            for="lastName"
            class="control-label"
          >
            <component :is="props.i18n.msg('lastName')" />
          </label>
          <span class="required">*</span>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="text"
            class="form-control"
            id="lastName"
            name="lastName"
            :value="account.lastName ?? ''"
          />
        </div>
      </div>

      <div class="form-group">
        <div
          id="kc-form-buttons"
          class="col-md-offset-2 col-md-10 submit"
        >
          <div>
            <a
              v-if="referrer !== undefined"
              :href="referrer?.url"
            >
              <component :is="props.i18n.msg('backToApplication')" />
            </a>
            <button
              type="submit"
              :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
              name="submitAction"
              value="Save"
            >
              <component :is="props.i18n.msg('doSave')" />
            </button>
            <button
              type="submit"
              :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
              name="submitAction"
              value="Cancel"
            >
              <component :is="props.i18n.msg('doCancel')" />
            </button>
          </div>
        </div>
      </div>
    </form>
  </component>
</template>
