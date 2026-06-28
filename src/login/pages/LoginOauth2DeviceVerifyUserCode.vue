<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props =
  defineProps<
    PageProps<
      Extract<
        KcContext,
        { pageId: "login-oauth2-device-verify-user-code.ftl" }
      >,
      I18n
    >
  >();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="i18n"
    :doUseDefaultCss="doUseDefaultCss"
    :classes="classes"
  >
    <template #header>
      <component :is="i18n.msg('oauth2DeviceVerificationTitle')" />
    </template>

    <form
      id="kc-user-verify-device-user-code-form"
      :class="kcClsx('kcFormClass')"
      :action="url.oauth2DeviceVerificationAction"
      method="post"
    >
      <div :class="kcClsx('kcFormGroupClass')">
        <div :class="kcClsx('kcLabelWrapperClass')">
          <label for="device-user-code" :class="kcClsx('kcLabelClass')">
            <component :is="i18n.msg('verifyOAuth2DeviceUserCode')" />
          </label>
        </div>

        <div :class="kcClsx('kcInputWrapperClass')">
          <input
            id="device-user-code"
            name="device_user_code"
            autocomplete="off"
            type="text"
            :class="kcClsx('kcInputClass')"
            autofocus
          />
        </div>
      </div>

      <div :class="kcClsx('kcFormGroupClass')">
        <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
          <div :class="kcClsx('kcFormOptionsWrapperClass')"></div>
        </div>

        <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
          <div :class="kcClsx('kcFormButtonsWrapperClass')">
            <input
              :class="
                kcClsx(
                  'kcButtonClass',
                  'kcButtonPrimaryClass',
                  'kcButtonLargeClass',
                )
              "
              type="submit"
              :value="i18n.msgStr('doSubmit')"
            />
          </div>
        </div>
      </div>
    </form>
  </component>
</template>
