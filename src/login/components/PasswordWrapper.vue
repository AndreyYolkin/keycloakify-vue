<script setup lang="ts">
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import { assert } from 'keycloakify/tools/assert';
import { ref, watch } from 'vue';
import type { I18n } from '../i18n/i18n';

const props = defineProps<{
  kcClsx: KcClsx;
  i18n: I18n;
  passwordInputId: string;
}>();

const isPasswordRevealed = ref(false);

watch(
  isPasswordRevealed,
  (revealed) => {
    const el = document.getElementById(props.passwordInputId);
    assert(el instanceof HTMLInputElement);
    el.type = revealed ? 'text' : 'password';
  },
  { immediate: false },
);
</script>

<template>
  <div :class="kcClsx('kcInputGroup')">
    <slot />
    <button
      type="button"
      :class="kcClsx('kcFormPasswordVisibilityButtonClass')"
      :aria-label="i18n.msgStr(isPasswordRevealed ? 'hidePassword' : 'showPassword')"
      :aria-controls="passwordInputId"
      @click="isPasswordRevealed = !isPasswordRevealed"
    >
      <i
        :class="kcClsx(isPasswordRevealed ? 'kcFormPasswordVisibilityIconHide' : 'kcFormPasswordVisibilityIconShow')"
        aria-hidden="true"
      ></i>
    </button>
  </div>
</template>
