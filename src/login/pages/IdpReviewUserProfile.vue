<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { ref, type Component } from "vue";
import type { UserProfileFormFieldsProps } from "../components/UserProfileFormFieldsProps";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<
  PageProps<
    Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>,
    I18n
  > & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  }
>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, messagesPerField } = kcContext;

const isFormSubmittable = ref(false);
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
    :displayMessage="messagesPerField.exists('global')"
    :displayRequiredFields="true"
  >
    <template #header>
      <component :is="props.i18n.msg('loginIdpReviewProfileTitle')" />
    </template>

    <form
      id="kc-idp-review-profile-form"
      :class="kcClsx('kcFormClass')"
      :action="url.loginAction"
      method="post"
    >
      <component
        :is="UserProfileFormFields"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :kcClsx="kcClsx"
        :onIsFormSubmittableValueChange="
          (value: boolean) => (isFormSubmittable = value)
        "
        :doMakeUserConfirmPassword="doMakeUserConfirmPassword"
      />

      <div :class="kcClsx('kcFormGroupClass')">
        <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
          <div :class="kcClsx('kcFormOptionsWrapperClass')" />
        </div>
        <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
          <input
            :disabled="!isFormSubmittable"
            :class="
              kcClsx(
                'kcButtonClass',
                'kcButtonPrimaryClass',
                'kcButtonBlockClass',
                'kcButtonLargeClass',
              )
            "
            type="submit"
            :value="props.i18n.msgStr('doSubmit')"
          />
        </div>
      </div>
    </form>
  </component>
</template>
