<script setup lang="ts">
import { assert } from 'keycloakify/tools/assert';
import { computed } from 'vue';
import { inputLabel } from './inputLabel';
import type { InputFieldByTypeProps } from './InputFieldByTypeProps';

const props = defineProps<InputFieldByTypeProps>();

const isMultiple = computed(() => props.attribute.annotations.inputType === 'multiselect');

const options = computed<string[]>(() => {
  const { inputOptionsFromValidation } = props.attribute.annotations;
  if (inputOptionsFromValidation !== undefined) {
    assert(typeof inputOptionsFromValidation === 'string');
    const validator = (props.attribute.validators as Record<string, { options?: string[] }>)[
      inputOptionsFromValidation
    ];
    if (validator?.options !== undefined) {
      return validator.options;
    }
  }
  return props.attribute.validators.options?.options ?? [];
});

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  props.dispatchFormAction({
    action: 'update',
    name: props.attribute.name,
    valueOrValues: isMultiple.value ? Array.from(target.selectedOptions).map((option) => option.value) : target.value,
  });
}

function onBlur() {
  props.dispatchFormAction({
    action: 'focus lost',
    name: props.attribute.name,
    fieldIndex: undefined,
  });
}

const sizeAnno = computed(() =>
  props.attribute.annotations.inputTypeSize === undefined
    ? undefined
    : parseInt(`${props.attribute.annotations.inputTypeSize}`),
);
</script>

<template>
  <select
    :id="attribute.name"
    :name="attribute.name"
    :class="kcClsx('kcInputClass')"
    :aria-invalid="displayableErrors.length !== 0"
    :disabled="attribute.readOnly"
    :multiple="isMultiple"
    :size="sizeAnno"
    :value="valueOrValues"
    @change="onChange"
    @blur="onBlur"
  >
    <option
      v-if="!isMultiple"
      value=""
    ></option>
    <option
      v-for="option in options"
      :key="option"
      :value="option"
    >
      <component :is="inputLabel(i18n, attribute, option)" />
    </option>
  </select>
</template>
