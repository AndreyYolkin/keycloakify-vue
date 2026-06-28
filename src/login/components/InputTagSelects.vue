<script setup lang="ts">
import { assert } from 'keycloakify/tools/assert';
import { computed } from 'vue';
import { inputLabel } from './inputLabel';
import type { InputFieldByTypeProps } from './InputFieldByTypeProps';

const props = defineProps<InputFieldByTypeProps>();

const styling = computed(() => {
  const { inputType } = props.attribute.annotations;
  assert(inputType === 'select-radiobuttons' || inputType === 'multiselect-checkboxes');
  switch (inputType) {
    case 'select-radiobuttons':
      return {
        inputType: 'radio',
        classDiv: props.kcClsx('kcInputClassRadio'),
        classInput: props.kcClsx('kcInputClassRadioInput'),
        classLabel: props.kcClsx('kcInputClassRadioLabel'),
      };
    case 'multiselect-checkboxes':
      return {
        inputType: 'checkbox',
        classDiv: props.kcClsx('kcInputClassCheckbox'),
        classInput: props.kcClsx('kcInputClassCheckboxInput'),
        classLabel: props.kcClsx('kcInputClassCheckboxLabel'),
      };
    default:
      return {
        inputType: 'radio',
        classDiv: props.kcClsx('kcInputClassRadio'),
        classInput: props.kcClsx('kcInputClassRadioInput'),
        classLabel: props.kcClsx('kcInputClassRadioLabel'),
      };
  }
});

const options = computed<string[]>(() => {
  const { inputOptionsFromValidation } = props.attribute.annotations;
  if (inputOptionsFromValidation !== undefined) {
    const validator = (props.attribute.validators as Record<string, { options?: string[] }>)[
      inputOptionsFromValidation
    ];
    if (validator?.options !== undefined) {
      return validator.options;
    }
  }
  return props.attribute.validators.options?.options ?? [];
});

function isChecked(option: string) {
  return props.valueOrValues instanceof Array ? props.valueOrValues.includes(option) : props.valueOrValues === option;
}

function onChange(event: Event, option: string) {
  const target = event.target as HTMLInputElement;
  props.dispatchFormAction({
    action: 'update',
    name: props.attribute.name,
    valueOrValues: (() => {
      if (props.valueOrValues instanceof Array) {
        const newValues = [...props.valueOrValues];
        if (target.checked) {
          newValues.push(option);
        } else {
          newValues.splice(newValues.indexOf(option), 1);
        }
        return newValues;
      }
      return target.checked ? option : '';
    })(),
  });
}

function onBlur() {
  props.dispatchFormAction({
    action: 'focus lost',
    name: props.attribute.name,
    fieldIndex: undefined,
  });
}
</script>

<template>
  <div
    v-for="option in options"
    :key="option"
    :class="styling.classDiv"
  >
    <input
      :type="styling.inputType"
      :id="`${attribute.name}-${option}`"
      :name="attribute.name"
      :value="option"
      :class="styling.classInput"
      :aria-invalid="displayableErrors.length !== 0"
      :disabled="attribute.readOnly"
      :checked="isChecked(option)"
      @change="onChange($event, option)"
      @blur="onBlur"
    />
    <label
      :for="`${attribute.name}-${option}`"
      :class="`${styling.classLabel}${attribute.readOnly ? ` ${kcClsx('kcInputClassRadioCheckboxLabelDisabled')}` : ''}`"
    >
      <component :is="inputLabel(i18n, attribute, option)" />
    </label>
  </div>
</template>
