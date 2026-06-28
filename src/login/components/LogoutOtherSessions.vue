<script setup lang="ts">
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '../i18n/i18n';

defineProps<{ kcClsx: KcClsx; i18n: I18n }>();
</script>

<template>
  <div
    id="kc-form-options"
    :class="kcClsx('kcFormOptionsClass')"
  >
    <div :class="kcClsx('kcFormOptionsWrapperClass')">
      <div class="checkbox">
        <label>
          <input
            type="checkbox"
            id="logout-sessions"
            name="logout-sessions"
            value="on"
            :checked="true"
          />
          <component :is="i18n.msg('logoutOtherSessions')" />
        </label>
      </div>
    </div>
  </div>
</template>
