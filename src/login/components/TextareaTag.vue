<script setup lang="ts">
import { assert } from "keycloakify/tools/assert";
import { computed } from "vue";
import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";

const props = defineProps<InputFieldByTypeProps>();

const value = computed(() => {
    assert(typeof props.valueOrValues === "string");
    return props.valueOrValues;
});

const numAnno = (v: string | number | undefined) => (v === undefined ? undefined : parseInt(`${v}`));

function onChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    props.dispatchFormAction({ action: "update", name: props.attribute.name, valueOrValues: target.value });
}

function onBlur() {
    props.dispatchFormAction({ action: "focus lost", name: props.attribute.name, fieldIndex: undefined });
}
</script>

<template>
    <textarea
        :id="attribute.name"
        :name="attribute.name"
        :class="kcClsx('kcInputClass')"
        :aria-invalid="displayableErrors.length !== 0"
        :disabled="attribute.readOnly"
        :cols="numAnno(attribute.annotations.inputTypeCols)"
        :rows="numAnno(attribute.annotations.inputTypeRows)"
        :maxlength="numAnno(attribute.annotations.inputTypeMaxlength)"
        :value="value"
        @input="onChange"
        @blur="onBlur"
    ></textarea>
</template>
