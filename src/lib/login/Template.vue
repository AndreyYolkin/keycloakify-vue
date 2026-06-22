<script setup lang="ts">
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { computed, h, onMounted, useSlots } from "vue";
import type { KcContext } from "keycloakify/login/KcContext";
import type { I18n } from "./i18n/i18n";
import type { TemplateProps } from "./TemplateProps";
import { useInitialize } from "./Template.useInitialize";
import { useSetClassName } from "../tools/useSetClassName";

const props = withDefaults(defineProps<TemplateProps<KcContext, I18n>>(), {
    displayInfo: false,
    displayMessage: true,
    displayRequiredFields: false,
    showAnotherWayIfPresent: true
});

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const i18n = computed(() => props.i18n.value);
const kcContext = props.kcContext;
const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

const slots = useSlots();

onMounted(() => {
    document.title = props.documentTitle ?? props.i18n.value.msgStr("loginTitle", kcContext.realm.displayName);
});

useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
useSetClassName({ qualifiedName: "body", className: props.bodyClassName ?? kcClsx("kcBodyClass") });

const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: props.doUseDefaultCss });

const showUsernameNode = computed(() => auth !== undefined && auth.showUsername && !auth.showResetCredentials);

const headerSection = () => {
    if (!showUsernameNode.value) {
        return h("h1", { id: "kc-page-title" }, slots.header?.());
    }
    return h("div", { id: "kc-username", class: kcClsx("kcFormGroupClass") }, [
        h("label", { id: "kc-attempted-username" }, auth!.attemptedUsername),
        h(
            "a",
            { id: "reset-login", href: url.loginRestartFlowUrl, "aria-label": i18n.value.msgStr("restartLoginTooltip") },
            h("div", { class: "kc-login-tooltip" }, [
                h("i", { class: kcClsx("kcResetFlowIcon") }),
                h("span", { class: "kc-tooltip-text" }, i18n.value.msgStr("restartLoginTooltip"))
            ])
        )
    ]);
};

function onTryAnotherWay() {
    (document.forms as any)["kc-select-try-another-way-form"].requestSubmit();
}
</script>

<template>
    <div v-if="isReadyToRender" :class="kcClsx('kcLoginClass')">
        <div id="kc-header" :class="kcClsx('kcHeaderClass')">
            <div id="kc-header-wrapper" :class="kcClsx('kcHeaderWrapperClass')">
                {{ i18n.msgStr("loginTitleHtml", realm.displayNameHtml) }}
            </div>
        </div>

        <div :class="kcClsx('kcFormCardClass')">
            <header :class="kcClsx('kcFormHeaderClass')">
                <div v-if="i18n.enabledLanguages.length > 1" :class="kcClsx('kcLocaleMainClass')" id="kc-locale">
                    <div id="kc-locale-wrapper" :class="kcClsx('kcLocaleWrapperClass')">
                        <div id="kc-locale-dropdown" :class="clsx('menu-button-links', kcClsx('kcLocaleDropDownClass'))">
                            <button
                                :tabindex="1"
                                id="kc-current-locale-link"
                                :aria-label="i18n.msgStr('languages')"
                                aria-haspopup="true"
                                aria-expanded="false"
                                aria-controls="language-switch1"
                            >
                                {{ i18n.currentLanguage.label }}
                            </button>
                            <ul
                                role="menu"
                                :tabindex="-1"
                                aria-labelledby="kc-current-locale-link"
                                aria-activedescendant=""
                                id="language-switch1"
                                :class="kcClsx('kcLocaleListClass')"
                            >
                                <li
                                    v-for="(enabledLanguage, i) in i18n.enabledLanguages"
                                    :key="enabledLanguage.languageTag"
                                    :class="kcClsx('kcLocaleListItemClass')"
                                    role="none"
                                >
                                    <a
                                        role="menuitem"
                                        :id="`language-${i + 1}`"
                                        :class="kcClsx('kcLocaleItemClass')"
                                        :href="enabledLanguage.href"
                                    >
                                        {{ enabledLanguage.label }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <template v-if="displayRequiredFields">
                    <div :class="kcClsx('kcContentWrapperClass')">
                        <div :class="clsx(kcClsx('kcLabelWrapperClass'), 'subtitle')">
                            <span class="subtitle">
                                <span class="required">*</span>
                                {{ i18n.msgStr("requiredFields") }}
                            </span>
                        </div>
                        <div class="col-md-10">
                            <component :is="headerSection" />
                        </div>
                    </div>
                </template>
                <component v-else :is="headerSection" />
            </header>

            <div id="kc-content">
                <div id="kc-content-wrapper">
                    <div
                        v-if="displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction)"
                        :class="clsx(`alert-${message.type}`, kcClsx('kcAlertClass'), `pf-m-${message?.type === 'error' ? 'danger' : message.type}`)"
                    >
                        <div class="pf-c-alert__icon">
                            <span v-if="message.type === 'success'" :class="kcClsx('kcFeedbackSuccessIcon')"></span>
                            <span v-else-if="message.type === 'warning'" :class="kcClsx('kcFeedbackWarningIcon')"></span>
                            <span v-else-if="message.type === 'error'" :class="kcClsx('kcFeedbackErrorIcon')"></span>
                            <span v-else-if="message.type === 'info'" :class="kcClsx('kcFeedbackInfoIcon')"></span>
                        </div>
                        <span :class="kcClsx('kcAlertTitleClass')" v-html="kcSanitize(message.summary)"></span>
                    </div>

                    <slot />

                    <form
                        v-if="auth !== undefined && auth.showTryAnotherWayLink"
                        id="kc-select-try-another-way-form"
                        :action="url.loginAction"
                        method="post"
                    >
                        <div :class="kcClsx('kcFormGroupClass')">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a href="#" id="try-another-way" @click.prevent="onTryAnotherWay">
                                {{ i18n.msgStr("doTryAnotherWay") }}
                            </a>
                        </div>
                    </form>

                    <slot name="socialProviders" />

                    <div v-if="displayInfo" id="kc-info" :class="kcClsx('kcSignUpClass')">
                        <div id="kc-info-wrapper" :class="kcClsx('kcInfoAreaWrapperClass')">
                            <slot name="info" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
