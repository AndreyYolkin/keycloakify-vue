<script setup lang="ts">
import { computed } from "vue";
import InputTag from "./InputTag.vue";
import InputTagSelects from "./InputTagSelects.vue";
import PasswordWrapper from "./PasswordWrapper.vue";
import SelectTag from "./SelectTag.vue";
import TextareaTag from "./TextareaTag.vue";
import type { InputFieldByTypeProps } from "./InputFieldByTypeProps";

const props = defineProps<InputFieldByTypeProps>();

const inputType = computed(() => props.attribute.annotations.inputType ?? "");

const isPasswordField = computed(() => ["password", "password-confirm"].includes(props.attribute.name));
</script>

<template>
    <input v-if="inputType === 'hidden'" type="hidden" :name="attribute.name" :value="valueOrValues" />

    <TextareaTag
        v-else-if="inputType === 'textarea'"
        :attribute="attribute"
        :valueOrValues="valueOrValues"
        :displayableErrors="displayableErrors"
        :dispatchFormAction="dispatchFormAction"
        :i18n="i18n"
        :kcClsx="kcClsx"
    />

    <SelectTag
        v-else-if="['select', 'multiselect'].includes(inputType)"
        :attribute="attribute"
        :valueOrValues="valueOrValues"
        :displayableErrors="displayableErrors"
        :dispatchFormAction="dispatchFormAction"
        :i18n="i18n"
        :kcClsx="kcClsx"
    />

    <InputTagSelects
        v-else-if="['select-radiobuttons', 'multiselect-checkboxes'].includes(inputType)"
        :attribute="attribute"
        :valueOrValues="valueOrValues"
        :displayableErrors="displayableErrors"
        :dispatchFormAction="dispatchFormAction"
        :i18n="i18n"
        :kcClsx="kcClsx"
    />

    <template v-else-if="valueOrValues instanceof Array">
        <InputTag
            v-for="(_, i) in valueOrValues"
            :key="i"
            :attribute="attribute"
            :valueOrValues="valueOrValues"
            :displayableErrors="displayableErrors"
            :dispatchFormAction="dispatchFormAction"
            :i18n="i18n"
            :kcClsx="kcClsx"
            :fieldIndex="i"
        />
    </template>

    <PasswordWrapper v-else-if="isPasswordField" :kcClsx="kcClsx" :i18n="i18n" :passwordInputId="attribute.name">
        <InputTag
            :attribute="attribute"
            :valueOrValues="valueOrValues"
            :displayableErrors="displayableErrors"
            :dispatchFormAction="dispatchFormAction"
            :i18n="i18n"
            :kcClsx="kcClsx"
        />
    </PasswordWrapper>

    <InputTag
        v-else
        :attribute="attribute"
        :valueOrValues="valueOrValues"
        :displayableErrors="displayableErrors"
        :dispatchFormAction="dispatchFormAction"
        :i18n="i18n"
        :kcClsx="kcClsx"
    />
</template>
