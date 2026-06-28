<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { ref, useTemplateRef } from "vue";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "select-organization.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, user } = kcContext;

const isSubmitting = ref(false);
const formRef = useTemplateRef<HTMLFormElement>("formRef");
const organizationInputRef = useTemplateRef<HTMLInputElement>("organizationInputRef");

const organizations = user.organizations ?? [];
const shouldDisplayGrid = organizations.length > 3;

function onOrganizationClick(organizationAlias: string) {
    return (event: MouseEvent) => {
        event.preventDefault();

        if (!organizationInputRef.value || !formRef.value) {
            return;
        }

        organizationInputRef.value.value = organizationAlias;
        isSubmitting.value = true;

        if (typeof formRef.value.requestSubmit === "function") {
            formRef.value.requestSubmit();
            return;
        }

        formRef.value.submit();
    };
}
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
    >
        <form ref="formRef" :action="url.loginAction" class="form-vertical" method="post">
            <div id="kc-user-organizations" :class="kcClsx('kcFormGroupClass')">
                <h2><component :is="i18n.msg('organization.select')" /></h2>
                <ul :class="kcClsx('kcFormSocialAccountListClass', shouldDisplayGrid && 'kcFormSocialAccountListGridClass')">
                    <li v-for="{ alias, name } in organizations" :key="alias">
                        <button
                            :id="`organization-${alias}`"
                            :class="kcClsx('kcFormSocialAccountListButtonClass', shouldDisplayGrid && 'kcFormSocialAccountGridItem')"
                            type="button"
                            :disabled="isSubmitting"
                            @click="onOrganizationClick(alias)"
                        >
                            <span :class="kcClsx('kcFormSocialAccountNameClass')">{{ name ?? alias }}</span>
                        </button>
                    </li>
                </ul>
            </div>
            <input ref="organizationInputRef" type="hidden" name="kc.org" />
        </form>
    </component>
</template>
