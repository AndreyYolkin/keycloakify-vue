<script setup lang="ts">
import type { Attribute } from "keycloakify/login/KcContext";
import { computed } from "vue";
import { getButtonToDisplayForMultivaluedAttributeField, type FormAction } from "../lib/useUserProfileForm";
import type { I18n } from "../i18n/i18n";

const props = defineProps<{
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: (action: Extract<FormAction, { action: "update" }>) => void;
    i18n: I18n;
}>();

const buttons = computed(() =>
    getButtonToDisplayForMultivaluedAttributeField({
        attribute: props.attribute,
        values: props.values,
        fieldIndex: props.fieldIndex
    })
);

const idPostfix = `-${props.attribute.name}-${props.fieldIndex + 1}`;
</script>

<template>
    <template v-if="buttons.hasRemove">
        <button
            :id="`kc-remove${idPostfix}`"
            type="button"
            class="pf-c-button pf-m-inline pf-m-link"
            @click="
                dispatchFormAction({
                    action: 'update',
                    name: attribute.name,
                    valueOrValues: values.filter((_, i) => i !== fieldIndex)
                })
            "
        >
            <component :is="i18n.msg('remove')" />
        </button>
        <template v-if="buttons.hasAdd">&nbsp;|&nbsp;</template>
    </template>
    <button
        v-if="buttons.hasAdd"
        :id="`kc-add${idPostfix}`"
        type="button"
        class="pf-c-button pf-m-inline pf-m-link"
        @click="
            dispatchFormAction({
                action: 'update',
                name: attribute.name,
                valueOrValues: [...values, '']
            })
        "
    >
        <component :is="i18n.msg('addValue')" />
    </button>
</template>
