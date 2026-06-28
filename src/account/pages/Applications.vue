<script setup lang="ts">
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import type { KcContext } from 'keycloakify/account/KcContext';
import type { I18n } from '../i18n/i18n';
import type { PageProps } from './PageProps';

const props = defineProps<PageProps<Extract<KcContext, { pageId: 'applications.ftl' }>, I18n>>();

const { kcClsx } = getKcClsx({
  doUseDefaultCss: props.doUseDefaultCss,
  classes: props.classes,
});

const kcContext = props.kcContext;
const {
  url,
  applications: { applications },
  stateChecker,
} = kcContext;

function isArrayWithEmptyObject(variable: unknown): boolean {
  return (
    Array.isArray(variable) &&
    variable.length === 1 &&
    typeof variable[0] === 'object' &&
    variable[0] !== null &&
    Object.keys(variable[0]).length === 0
  );
}
</script>

<template>
  <component
    :is="Template"
    :kcContext="kcContext"
    :i18n="props.i18n"
    :doUseDefaultCss="props.doUseDefaultCss"
    :classes="props.classes"
    active="applications"
  >
    <div class="row">
      <div class="col-md-10">
        <h2><component :is="props.i18n.msg('applicationsHtmlTitle')" /></h2>
      </div>

      <form
        :action="url.applicationsUrl"
        method="post"
      >
        <input
          type="hidden"
          id="stateChecker"
          name="stateChecker"
          :value="stateChecker"
        />
        <input
          type="hidden"
          id="referrer"
          name="referrer"
          :value="stateChecker"
        />

        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <td><component :is="props.i18n.msg('application')" /></td>
              <td><component :is="props.i18n.msg('availableRoles')" /></td>
              <td><component :is="props.i18n.msg('grantedPermissions')" /></td>
              <td><component :is="props.i18n.msg('additionalGrants')" /></td>
              <td><component :is="props.i18n.msg('action')" /></td>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="application in applications"
              :key="application.client.clientId"
            >
              <!-- Application name cell -->
              <td>
                <template v-if="application.effectiveUrl">
                  <a :href="application.effectiveUrl">
                    <template v-if="application.client.name">
                      <component :is="props.i18n.advancedMsg(application.client.name)" />
                    </template>
                    <template v-else>{{ application.client.clientId }}</template>
                  </a>
                </template>
                <template v-else>
                  <template v-if="application.client.name">
                    <component :is="props.i18n.advancedMsg(application.client.name)" />
                  </template>
                  <template v-else>{{ application.client.clientId }}</template>
                </template>
              </td>

              <!-- Available roles cell -->
              <td>
                <template v-if="!isArrayWithEmptyObject(application.realmRolesAvailable)">
                  <span
                    v-for="(role, index) in application.realmRolesAvailable"
                    :key="role.name"
                  >
                    <template v-if="role.description">
                      <component :is="props.i18n.advancedMsg(role.description)" />
                    </template>
                    <template v-else>
                      <component :is="props.i18n.advancedMsg(role.name)" />
                    </template>
                    <template v-if="index < application.realmRolesAvailable.length - 1">, </template>
                  </span>
                </template>

                <template v-if="application.resourceRolesAvailable">
                  <span
                    v-for="resource in Object.keys(application.resourceRolesAvailable)"
                    :key="resource"
                  >
                    <template v-if="!isArrayWithEmptyObject(application.realmRolesAvailable)">, </template>
                    <span
                      v-for="(clientRole, roleIndex) in application.resourceRolesAvailable[resource]"
                      :key="clientRole.roleName"
                    >
                      <template v-if="clientRole.roleDescription">
                        <component :is="props.i18n.advancedMsg(clientRole.roleDescription)" />
                      </template>
                      <template v-else>
                        <component :is="props.i18n.advancedMsg(clientRole.roleName)" />
                      </template>
                      {{ ' ' }}<component :is="props.i18n.msg('inResource')" />{{ ' ' }}
                      <strong>
                        <template v-if="clientRole.clientName">
                          <component :is="props.i18n.advancedMsg(clientRole.clientName)" />
                        </template>
                        <template v-else>{{ clientRole.clientId }}</template>
                      </strong>
                      <template v-if="roleIndex < application.resourceRolesAvailable[resource].length - 1">, </template>
                    </span>
                  </span>
                </template>
              </td>

              <!-- Granted permissions cell -->
              <td>
                <template v-if="application.client.consentRequired">
                  <span
                    v-for="(claim, claimIndex) in application.clientScopesGranted"
                    :key="claim"
                  >
                    <component :is="props.i18n.advancedMsg(claim)" />
                    <template v-if="claimIndex < application.clientScopesGranted.length - 1">, </template>
                  </span>
                </template>
                <template v-else>
                  <strong><component :is="props.i18n.msg('fullAccess')" /></strong>
                </template>
              </td>

              <!-- Additional grants cell -->
              <td>
                <span
                  v-for="(grant, grantIndex) in application.additionalGrants"
                  :key="grant"
                >
                  <component :is="props.i18n.advancedMsg(grant)" />
                  <template v-if="grantIndex < application.additionalGrants.length - 1">, </template>
                </span>
              </td>

              <!-- Action cell -->
              <td>
                <button
                  v-if="
                    (application.client.consentRequired && application.clientScopesGranted.length > 0) ||
                    application.additionalGrants.length > 0
                  "
                  type="submit"
                  :class="kcClsx('kcButtonPrimaryClass', 'kcButtonClass')"
                  :id="`revoke-${application.client.clientId}`"
                  name="clientId"
                  :value="application.client.id"
                >
                  <component :is="props.i18n.msg('revoke')" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </component>
</template>
