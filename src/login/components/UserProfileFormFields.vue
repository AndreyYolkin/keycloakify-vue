<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { computed, watch } from "vue";
import FieldErrors from "./FieldErrors.vue";
import GroupLabel from "./GroupLabel.vue";
import InputFieldByType from "./InputFieldByType.vue";
import type { UserProfileFormFieldsProps } from "./UserProfileFormFieldsProps";
import { useUserProfileForm } from "../lib/useUserProfileForm";
import type { I18n } from "../i18n/i18n";

const props = defineProps<UserProfileFormFieldsProps<KcContext, I18n>>();

const { formState, dispatchFormAction } = useUserProfileForm({
    kcContext: props.kcContext,
    i18n: props.i18n,
    doMakeUserConfirmPassword: props.doMakeUserConfirmPassword
});

watch(
    () => formState.value.isFormSubmittable,
    isFormSubmittable => props.onIsFormSubmittableValueChange(isFormSubmittable),
    { immediate: true }
);

const groupNameRef = { current: "" };

const fieldRows = computed(() =>
    formState.value.formFieldStates.map(formFieldState => {
        const { attribute, valueOrValues, displayableErrors } = formFieldState;
        const isHidden =
            attribute.annotations.inputType === "hidden" ||
            (attribute.name === "password-confirm" && !props.doMakeUserConfirmPassword);
        return { attribute, valueOrValues, displayableErrors, isHidden };
    })
);
</script>

<template>
    <template v-for="(row, i) in fieldRows" :key="i">
        <GroupLabel :attribute="row.attribute" :groupNameRef="groupNameRef" :i18n="i18n" :kcClsx="kcClsx" />

        <slot
            name="beforeField"
            :attribute="row.attribute"
            :dispatchFormAction="dispatchFormAction"
            :displayableErrors="row.displayableErrors"
            :valueOrValues="row.valueOrValues"
            :kcClsx="kcClsx"
            :i18n="i18n"
        />

        <div :class="kcClsx('kcFormGroupClass')" :style="{ display: row.isHidden ? 'none' : undefined }">
            <div :class="kcClsx('kcLabelWrapperClass')">
                <label :for="row.attribute.name" :class="kcClsx('kcLabelClass')">
                    <component :is="i18n.advancedMsg(row.attribute.displayName ?? '')" />
                </label>
                <template v-if="row.attribute.required">&nbsp;*</template>
            </div>
            <div :class="kcClsx('kcInputWrapperClass')">
                <div
                    v-if="row.attribute.annotations.inputHelperTextBefore !== undefined"
                    :class="kcClsx('kcInputHelperTextBeforeClass')"
                    :id="`form-help-text-before-${row.attribute.name}`"
                    aria-live="polite"
                >
                    <component :is="i18n.advancedMsg(row.attribute.annotations.inputHelperTextBefore)" />
                </div>

                <InputFieldByType
                    :attribute="row.attribute"
                    :valueOrValues="row.valueOrValues"
                    :displayableErrors="row.displayableErrors"
                    :dispatchFormAction="dispatchFormAction"
                    :kcClsx="kcClsx"
                    :i18n="i18n"
                />

                <FieldErrors :attribute="row.attribute" :displayableErrors="row.displayableErrors" :kcClsx="kcClsx" />

                <div
                    v-if="row.attribute.annotations.inputHelperTextAfter !== undefined"
                    :class="kcClsx('kcInputHelperTextAfterClass')"
                    :id="`form-help-text-after-${row.attribute.name}`"
                    aria-live="polite"
                >
                    <component :is="i18n.advancedMsg(row.attribute.annotations.inputHelperTextAfter)" />
                </div>

                <slot
                    name="afterField"
                    :attribute="row.attribute"
                    :dispatchFormAction="dispatchFormAction"
                    :displayableErrors="row.displayableErrors"
                    :valueOrValues="row.valueOrValues"
                    :kcClsx="kcClsx"
                    :i18n="i18n"
                />
            </div>
        </div>
    </template>
</template>
