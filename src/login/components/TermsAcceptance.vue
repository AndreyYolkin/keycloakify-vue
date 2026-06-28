<script setup lang="ts">
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { KcContext } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '../i18n/i18n';

const props = defineProps<{
  i18n: I18n;
  kcClsx: KcClsx;
  messagesPerField: Pick<KcContext['messagesPerField'], 'existsError' | 'get'>;
  areTermsAccepted: boolean;
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}>();

function onChange(event: Event) {
  props.onAreTermsAcceptedValueChange((event.target as HTMLInputElement).checked);
}
</script>

<template>
  <div class="form-group">
    <div :class="kcClsx('kcInputWrapperClass')">
      <component :is="i18n.msg('termsTitle')" />
      <div id="kc-registration-terms-text">
        <component :is="i18n.msg('termsText')" />
      </div>
    </div>
  </div>
  <div class="form-group">
    <div :class="kcClsx('kcLabelWrapperClass')">
      <input
        type="checkbox"
        id="termsAccepted"
        name="termsAccepted"
        :class="kcClsx('kcCheckboxInputClass')"
        :checked="areTermsAccepted"
        :aria-invalid="messagesPerField.existsError('termsAccepted')"
        @change="onChange"
      />
      <label
        for="termsAccepted"
        :class="kcClsx('kcLabelClass')"
      >
        <component :is="i18n.msg('acceptTerms')" />
      </label>
    </div>
    <div
      v-if="messagesPerField.existsError('termsAccepted')"
      :class="kcClsx('kcLabelWrapperClass')"
    >
      <span
        id="input-error-terms-accepted"
        :class="kcClsx('kcInputErrorMessageClass')"
        aria-live="polite"
        v-html="kcSanitize(messagesPerField.get('termsAccepted'))"
      ></span>
    </div>
  </div>
</template>
