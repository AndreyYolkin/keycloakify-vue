<script setup lang="ts">
import type { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "../i18n/i18n";
import type { PageProps } from "./PageProps";

const props = defineProps<PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>>();

const { kcClsx } = getKcClsx({ doUseDefaultCss: props.doUseDefaultCss, classes: props.classes });

const kcContext = props.kcContext;
const { url, oauth, client } = kcContext;
</script>

<template>
    <component
        :is="Template"
        :kcContext="kcContext"
        :i18n="i18n"
        :doUseDefaultCss="doUseDefaultCss"
        :classes="classes"
        bodyClassName="oauth"
    >
        <template #header>
            <img v-if="client.attributes.logoUri" :src="client.attributes.logoUri" alt="logo" />
            <p>
                <component
                    v-if="client.name"
                    :is="i18n.msg('oauthGrantTitle', i18n.advancedMsgStr(client.name))"
                />
                <component
                    v-else
                    :is="i18n.msg('oauthGrantTitle', client.clientId)"
                />
            </p>
        </template>

        <div id="kc-oauth" class="content-area">
            <h3><component :is="i18n.msg('oauthGrantRequest')" /></h3>
            <ul>
                <li v-for="clientScope in oauth.clientScopesRequested" :key="clientScope.consentScreenText">
                    <span>
                        <component :is="i18n.advancedMsg(clientScope.consentScreenText)" />
                        <template v-if="clientScope.dynamicScopeParameter">
                            : <b>{{ clientScope.dynamicScopeParameter }}</b>
                        </template>
                    </span>
                </li>
            </ul>

            <h3 v-if="client.attributes.policyUri || client.attributes.tosUri">
                <component
                    v-if="client.name"
                    :is="i18n.msg('oauthGrantInformation', i18n.advancedMsgStr(client.name))"
                />
                <component
                    v-else
                    :is="i18n.msg('oauthGrantInformation', client.clientId)"
                />
                <template v-if="client.attributes.tosUri">
                    <component :is="i18n.msg('oauthGrantReview')" />
                    <a :href="client.attributes.tosUri" target="_blank">
                        <component :is="i18n.msg('oauthGrantTos')" />
                    </a>
                </template>
                <template v-if="client.attributes.policyUri">
                    <component :is="i18n.msg('oauthGrantReview')" />
                    <a :href="client.attributes.policyUri" target="_blank">
                        <component :is="i18n.msg('oauthGrantPolicy')" />
                    </a>
                </template>
            </h3>

            <form class="form-actions" :action="url.oauthAction" method="POST">
                <input type="hidden" name="code" :value="oauth.code" />
                <div :class="kcClsx('kcFormGroupClass')">
                    <div id="kc-form-options">
                        <div :class="kcClsx('kcFormOptionsWrapperClass')"></div>
                    </div>

                    <div id="kc-form-buttons">
                        <div :class="kcClsx('kcFormButtonsWrapperClass')">
                            <input
                                :class="kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')"
                                name="accept"
                                id="kc-login"
                                type="submit"
                                :value="i18n.msgStr('doYes')"
                            />
                            <input
                                :class="kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')"
                                name="cancel"
                                id="kc-cancel"
                                type="submit"
                                :value="i18n.msgStr('doNo')"
                            />
                        </div>
                    </div>
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </component>
</template>
