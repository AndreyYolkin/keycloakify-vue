<script setup lang="ts">
import { assert } from 'keycloakify/tools/assert';
import { computed } from 'vue';
import AddRemoveButtonsMultiValuedAttribute from './AddRemoveButtonsMultiValuedAttribute.vue';
import FieldErrors from './FieldErrors.vue';
import type { InputFieldByTypeProps } from './InputFieldByTypeProps';

const props = defineProps<InputFieldByTypeProps & { fieldIndex?: number }>();

const inputType = computed(() => {
  const t = props.attribute.annotations.inputType;
  return t?.startsWith('html5-') ? t.slice(6) : (t ?? 'text');
});

const value = computed(() => {
  if (props.fieldIndex !== undefined) {
    assert(props.valueOrValues instanceof Array);
    return props.valueOrValues[props.fieldIndex];
  }
  assert(typeof props.valueOrValues === 'string');
  return props.valueOrValues;
});

// NOTE: the input gets the attribute's OWN html5DataAnnotations (e.g. kcNumberFormat),
// not the group's — matches the React source of truth (the svelte port spreads
// `attribute.group?.html5DataAnnotations` here, which is a bug; the group annotations
// belong on the group container, handled in GroupLabel.vue).
const html5DataAnnotations = computed(() =>
  Object.fromEntries(
    Object.entries(props.attribute.html5DataAnnotations ?? {}).map(([key, val]) => [`data-${key}`, val]),
  ),
);

const ariaInvalid = computed(
  () => props.displayableErrors.find((error) => error.fieldIndex === props.fieldIndex) !== undefined,
);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  props.dispatchFormAction({
    action: 'update',
    name: props.attribute.name,
    valueOrValues: (() => {
      if (props.fieldIndex !== undefined) {
        assert(props.valueOrValues instanceof Array);
        return props.valueOrValues.map((v, i) => (i === props.fieldIndex ? target.value : v));
      }
      return target.value;
    })(),
  });
}

function onBlur() {
  props.dispatchFormAction({
    action: 'focus lost',
    name: props.attribute.name,
    fieldIndex: props.fieldIndex,
  });
}

const numAnno = (v: string | number | undefined) => (v === undefined ? undefined : parseInt(`${v}`));
</script>

<template>
  <input
    :type="inputType"
    :id="attribute.name"
    :name="attribute.name"
    :value="value"
    :class="kcClsx('kcInputClass')"
    :aria-invalid="ariaInvalid"
    :disabled="attribute.readOnly"
    :autocomplete="attribute.autocomplete as any"
    :placeholder="
      attribute.annotations.inputTypePlaceholder === undefined
        ? undefined
        : i18n.advancedMsgStr(attribute.annotations.inputTypePlaceholder)
    "
    :pattern="attribute.annotations.inputTypePattern"
    :size="numAnno(attribute.annotations.inputTypeSize)"
    :maxlength="numAnno(attribute.annotations.inputTypeMaxlength)"
    :minlength="numAnno(attribute.annotations.inputTypeMinlength)"
    :max="attribute.annotations.inputTypeMax"
    :min="attribute.annotations.inputTypeMin"
    :step="attribute.annotations.inputTypeStep"
    v-bind="html5DataAnnotations"
    @input="onInput"
    @blur="onBlur"
  />
  <template v-if="fieldIndex !== undefined && valueOrValues instanceof Array">
    <FieldErrors
      :attribute="attribute"
      :kcClsx="kcClsx"
      :displayableErrors="displayableErrors"
      :fieldIndex="fieldIndex"
    />
    <AddRemoveButtonsMultiValuedAttribute
      :attribute="attribute"
      :values="valueOrValues"
      :fieldIndex="fieldIndex"
      :dispatchFormAction="dispatchFormAction"
      :i18n="i18n"
    />
  </template>
</template>
