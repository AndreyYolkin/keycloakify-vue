<script setup lang="ts">
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'federatedIdentity.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const { url, federatedIdentity, stateChecker } = kcContext;
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active="social"
  >
    <div class="main-layout social">
      <div class="row">
        <div class="col-md-10">
          <h2><component :is="props.i18n.msg('federatedIdentitiesHtmlTitle')" /></h2>
        </div>
      </div>

      <div id="federated-identities">
        <div
          v-for="identity in federatedIdentity.identities"
          :key="identity.providerId"
          class="row margin-bottom"
        >
          <div class="col-sm-2 col-md-2">
            <label
              :for="identity.providerId"
              class="control-label"
            >
              {{ identity.displayName }}
            </label>
          </div>

          <div class="col-sm-5 col-md-5">
            <input
              disabled
              class="form-control"
              :value="identity.userName"
            />
          </div>

          <div class="col-sm-5 col-md-5">
            <template v-if="identity.connected">
              <form
                v-if="federatedIdentity.removeLinkPossible"
                :action="url.socialUrl"
                method="post"
                class="form-inline"
              >
                <input
                  type="hidden"
                  name="stateChecker"
                  :value="stateChecker"
                />
                <input
                  type="hidden"
                  name="action"
                  value="remove"
                />
                <input
                  type="hidden"
                  name="providerId"
                  :value="identity.providerId"
                />
                <button
                  :id="`remove-link-${identity.providerId}`"
                  class="btn btn-default"
                >
                  <component :is="props.i18n.msg('doRemove')" />
                </button>
              </form>
            </template>

            <template v-else>
              <form
                :action="url.socialUrl"
                method="post"
                class="form-inline"
              >
                <input
                  type="hidden"
                  name="stateChecker"
                  :value="stateChecker"
                />
                <input
                  type="hidden"
                  name="action"
                  value="add"
                />
                <input
                  type="hidden"
                  name="providerId"
                  :value="identity.providerId"
                />
                <button
                  :id="`add-link-${identity.providerId}`"
                  class="btn btn-default"
                >
                  <component :is="props.i18n.msg('doAdd')" />
                </button>
              </form>
            </template>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
