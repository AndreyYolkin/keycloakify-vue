<script setup lang="ts">
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import { computed } from 'vue';
import type { FormFieldError } from '../lib/useUserProfileForm';

const props = withDefaults(
  defineProps<{
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex?: number;
    kcClsx: KcClsx;
  }>(),
  { fieldIndex: undefined },
);

const errors = computed(() => props.displayableErrors.filter((error) => error.fieldIndex === props.fieldIndex));
</script>

<template>
  <span
    v-if="errors.length !== 0"
    :id="`input-error-${attribute.name}${fieldIndex === undefined ? '' : `-${fieldIndex}`}`"
    :class="kcClsx('kcInputErrorMessageClass')"
    aria-live="polite"
  >
    <template
      v-for="(displayableError, i) in errors"
      :key="i"
    >
      <component :is="displayableError.errorMessage" />
      <br v-if="errors.length - 1 !== i" />
    </template>
  </span>
</template>
