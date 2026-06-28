<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, x509 } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="props.i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
    >
        <template #header>
            <component :is="props.i18n.msg('doLogIn')" />
        </template>

        <form id="kc-x509-login-info" :class="kcClsx('kcFormClass')" :action="url.loginAction" method="post">
            <div :class="kcClsx('kcFormGroupClass')">
                <div :class="kcClsx('kcLabelWrapperClass')">
                    <label for="certificate_subjectDN" :class="kcClsx('kcLabelClass')">
                        <component :is="props.i18n.msg('clientCertificate')" />
                    </label>
                </div>
                <div v-if="x509.formData.subjectDN" :class="kcClsx('kcLabelWrapperClass')">
                    <label id="certificate_subjectDN" :class="kcClsx('kcLabelClass')">
                        {{ x509.formData.subjectDN }}
                    </label>
                </div>
                <div v-else :class="kcClsx('kcLabelWrapperClass')">
                    <label id="certificate_subjectDN" :class="kcClsx('kcLabelClass')">
                        <component :is="props.i18n.msg('noCertificate')" />
                    </label>
                </div>
            </div>
            <div :class="kcClsx('kcFormGroupClass')">
                <template v-if="x509.formData.isUserEnabled">
                    <div :class="kcClsx('kcLabelWrapperClass')">
                        <label for="username" :class="kcClsx('kcLabelClass')">
                            <component :is="props.i18n.msg('doX509Login')" />
                        </label>
                    </div>
                    <div :class="kcClsx('kcLabelWrapperClass')">
                        <label id="username" :class="kcClsx('kcLabelClass')">
                            {{ x509.formData.username }}
                        </label>
                    </div>
                </template>
            </div>
            <div :class="kcClsx('kcFormGroupClass')">
                <div id="kc-form-options" :class="kcClsx('kcFormOptionsClass')">
                    <div :class="kcClsx('kcFormOptionsWrapperClass')" />
                </div>
                <div id="kc-form-buttons" :class="kcClsx('kcFormButtonsClass')">
                    <div :class="kcClsx('kcFormButtonsWrapperClass')">
                        <input
                            :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                            name="login"
                            id="kc-login"
                            type="submit"
                            :value="props.i18n.msgStr('doContinue')"
                        />
                        <input
                            v-if="x509.formData.isUserEnabled"
                            :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                            name="cancel"
                            id="kc-cancel"
                            type="submit"
                            :value="props.i18n.msgStr('doIgnore')"
                        />
                    </div>
                </div>
            </div>
        </form>
    </component>
</template>
