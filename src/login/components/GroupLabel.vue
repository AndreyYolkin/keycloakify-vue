<script setup lang="ts">
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import { computed } from 'vue';
import type { I18n } from '../i18n/i18n';

const props = defineProps<{
  attribute: Attribute;
  groupNameRef: { current: string };
  i18n: I18n;
  kcClsx: KcClsx;
}>();

// Mirrors the svelte $effect: the first attribute of each new group renders the
// group header once. Group structure is static per mount, so compute in setup.
const isGroupLabel = (() => {
  if (props.attribute.group?.name !== props.groupNameRef.current) {
    // groupNameRef is a mutable ref-object (not a Vue prop value), mutation is intentional
    // eslint-disable-next-line vue/no-mutating-props
    props.groupNameRef.current = props.attribute.group?.name ?? '';
    if (props.groupNameRef.current !== '') {
      return true;
    }
  }
  return false;
})();

const html5DataAnnotations = computed(() =>
  Object.fromEntries(
    Object.entries(props.attribute.group?.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]),
  ),
);

const groupDisplayHeader = computed(() => props.attribute.group?.displayHeader ?? '');
const groupDisplayDescription = computed(() => props.attribute.group?.displayDescription ?? '');
</script>

<template>
  <div
    v-if="isGroupLabel"
    :class="kcClsx('kcFormGroupClass')"
    v-bind="html5DataAnnotations"
  >
    <div :class="kcClsx('kcContentWrapperClass')">
      <label
        :id="`header-${attribute.group?.name}`"
        :class="kcClsx('kcFormGroupHeader')"
      >
        <component
          v-if="groupDisplayHeader !== ''"
          :is="i18n.advancedMsg(groupDisplayHeader)"
        />
        <template v-else>{{ attribute.group?.name ?? '' }}</template>
      </label>
    </div>
    <div
      v-if="groupDisplayDescription !== ''"
      :class="kcClsx('kcLabelWrapperClass')"
    >
      <label
        :id="`description-${attribute.group?.name}`"
        :class="kcClsx('kcLabelClass')"
      >
        <component :is="i18n.advancedMsg(groupDisplayDescription)" />
      </label>
    </div>
  </div>
</template>
