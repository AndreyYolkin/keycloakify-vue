<script setup lang="ts">
import { ref, computed } from 'vue';
import { clsx } from 'keycloakify/tools/clsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'password.ftl' }>, I18n>>();

const classes = {
  ...props.classes,
  kcBodyClass: clsx(props.classes?.kcBodyClass, 'password'),
};

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes,
});

const { url, password, account, stateChecker } = props.kcContext;
const { msgStr, msg } = props.i18n;

// Reactive state for password fields
const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');
const newPasswordError = ref('');
const newPasswordConfirmError = ref('');
const hasNewPasswordBlurred = ref(false);
const hasNewPasswordConfirmBlurred = ref(false);

function checkNewPassword(value: string) {
  if (!password.passwordSet) {
    return;
  }
  if (value === currentPassword.value) {
    newPasswordError.value = msgStr('newPasswordSameAsOld');
  } else {
    newPasswordError.value = '';
  }
}

function checkNewPasswordConfirm(value: string) {
  if (value === '') {
    return;
  }
  if (newPassword.value !== value) {
    newPasswordConfirmError.value = msgStr('passwordConfirmNotMatch');
  } else {
    newPasswordConfirmError.value = '';
  }
}

function onNewPasswordChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  newPassword.value = value;
  if (hasNewPasswordBlurred.value) {
    checkNewPassword(value);
  }
}

function onNewPasswordBlur() {
  hasNewPasswordBlurred.value = true;
  checkNewPassword(newPassword.value);
}

function onNewPasswordConfirmChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  newPasswordConfirm.value = value;
  if (hasNewPasswordConfirmBlurred.value) {
    checkNewPasswordConfirm(value);
  }
}

function onNewPasswordConfirmBlur() {
  hasNewPasswordConfirmBlurred.value = true;
  checkNewPasswordConfirm(newPasswordConfirm.value);
}

// Synthetic kcContext override: replace message with client-side validation error
const kcContextWithMessageOverride = computed(() => ({
  ...props.kcContext,
  message: (() => {
    if (newPasswordError.value !== '') {
      return {
        type: 'error' as const,
        summary: newPasswordError.value,
      };
    }
    if (newPasswordConfirmError.value !== '') {
      return {
        type: 'error' as const,
        summary: newPasswordConfirmError.value,
      };
    }
    return props.kcContext.message;
  })(),
}));

const isSubmitDisabled = computed(
  () => newPasswordError.value !== '' || newPasswordConfirmError.value !== '',
);
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContextWithMessageOverride"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="classes"
    active="password"
  >
    <div class="row">
      <div class="col-md-10">
        <h2><component :is="msg('changePasswordHtmlTitle')" /></h2>
      </div>
      <div class="col-md-2 subtitle">
        <span class="subtitle">
          <component :is="msg('allFieldsRequired')" />
        </span>
      </div>
    </div>

    <form
      :action="url.passwordUrl"
      class="form-horizontal"
      method="post"
    >
      <!-- Hidden username input for password-manager autocomplete -->
      <input
        type="text"
        id="username"
        name="username"
        :value="account.username ?? ''"
        autocomplete="username"
        readonly
        style="display: none"
      />

      <!-- Current password (only shown when password is already set) -->
      <div
        v-if="password.passwordSet"
        class="form-group"
      >
        <div class="col-sm-2 col-md-2">
          <label
            for="password"
            class="control-label"
          >
            <component :is="msg('password')" />
          </label>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            autofocus
            autocomplete="current-password"
            :value="currentPassword"
            @change="(e) => { currentPassword = (e.target as HTMLInputElement).value }"
          />
        </div>
      </div>

      <input
        type="hidden"
        id="stateChecker"
        name="stateChecker"
        :value="stateChecker"
      />

      <!-- New password -->
      <div class="form-group">
        <div class="col-sm-2 col-md-2">
          <label
            for="password-new"
            class="control-label"
          >
            <component :is="msg('passwordNew')" />
          </label>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="password"
            class="form-control"
            id="password-new"
            name="password-new"
            autocomplete="new-password"
            :value="newPassword"
            @change="onNewPasswordChange"
            @blur="onNewPasswordBlur"
          />
        </div>
      </div>

      <!-- Confirm new password -->
      <div class="form-group">
        <div class="col-sm-2 col-md-2">
          <label
            for="password-confirm"
            class="control-label two-lines"
          >
            <component :is="msg('passwordConfirm')" />
          </label>
        </div>
        <div class="col-sm-10 col-md-10">
          <input
            type="password"
            class="form-control"
            id="password-confirm"
            name="password-confirm"
            autocomplete="new-password"
            :value="newPasswordConfirm"
            @change="onNewPasswordConfirmChange"
            @blur="onNewPasswordConfirmBlur"
          />
        </div>
      </div>

      <!-- Submit -->
      <div class="form-group">
        <div
          id="kc-form-buttons"
          class="col-md-offset-2 col-md-10 submit"
        >
          <div>
            <button
              :disabled="isSubmitDisabled"
              type="submit"
              :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
              name="submitAction"
              value="Save"
            >
              <component :is="msg('doSave')" />
            </button>
          </div>
        </div>
      </div>
    </form>
  </component>
</template>
