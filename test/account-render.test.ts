import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createGetKcContextMock } from 'keycloakify/account/KcContext';
import Account from '../src/account/pages/Account.vue';
import Applications from '../src/account/pages/Applications.vue';
import FederatedIdentity from '../src/account/pages/FederatedIdentity.vue';
import Log from '../src/account/pages/Log.vue';
import Password from '../src/account/pages/Password.vue';
import Sessions from '../src/account/pages/Sessions.vue';
import Template from '../src/account/Template.vue';
import { i18nBuilder } from '../src/account/i18n/i18nBuilder';

describe('Account.vue render', () => {
  it('renders the account form (email, firstName, lastName)', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = getKcContextMock({ pageId: 'account.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Account, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    const html = wrapper.html();
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="firstName"]').exists()).toBe(true);
    expect(wrapper.find('input[name="lastName"]').exists()).toBe(true);
    // sanity: the title/header rendered something
    expect(html.length).toBeGreaterThan(200);
  });
});

describe('Log.vue render', () => {
  it('renders the log table', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = getKcContextMock({ pageId: 'log.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Log, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.html().length).toBeGreaterThan(100);
  });
});

describe('Sessions.vue render', () => {
  it('renders the sessions table and logout form', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = getKcContextMock({ pageId: 'sessions.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Sessions, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[name="stateChecker"]').exists()).toBe(true);
    expect(wrapper.html().length).toBeGreaterThan(100);
  });
});

describe('FederatedIdentity.vue render', () => {
  it('renders federated identity forms with providerId inputs', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    // The default mock includes one connected identity (keycloak-oidc, connected: true, removeLinkPossible: true)
    const kcContext = getKcContextMock({ pageId: 'federatedIdentity.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(FederatedIdentity, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[name="providerId"]').exists()).toBe(true);
    expect(wrapper.find('input[name="stateChecker"]').exists()).toBe(true);
    expect(wrapper.html().length).toBeGreaterThan(100);
  });
});

describe('Applications.vue render', () => {
  it('renders the applications table with stateChecker', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = {
      ...getKcContextMock({ pageId: 'federatedIdentity.ftl' }),
      pageId: 'applications.ftl' as const,
      stateChecker: 'test-state-checker',
      applications: {
        applications: [
          {
            realmRolesAvailable: [{ name: 'user', description: 'User role' }],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: ['openid', 'profile'],
            effectiveUrl: '#',
            client: {
              clientId: 'test-app',
              name: 'Test Application',
              consentRequired: true,
              id: 'test-app-id',
              alwaysDisplayInConsole: false,
              attributes: {},
              authenticationFlowBindingOverrides: {},
              bearerOnly: false,
              clientAuthenticatorType: 'client-secret',
              consentScreenText: '',
              description: '',
              directAccessGrantsEnabled: true,
              displayOnConsentScreen: true,
              dynamicScope: false,
              enabled: true,
              frontchannelLogout: false,
              fullScopeAllowed: true,
              implicitFlowEnabled: false,
              includeInTokenScope: true,
              managementUrl: '',
              nodeReRegistrationTimeout: '0',
              notBefore: '0',
              protocol: 'openid-connect',
              protocolMappersStream: {},
              publicClient: false,
              realm: {},
              realmScopeMappingsStream: {},
              redirectUris: [],
              registeredNodes: {},
              rolesStream: {},
              scopeMappingsStream: {},
              secret: '',
              serviceAccountsEnabled: false,
              standardFlowEnabled: true,
              surrogateAuthRequired: false,
              webOrigins: [],
            },
          },
        ],
      },
    };

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Applications, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('input[name="stateChecker"]').exists()).toBe(true);
    expect(wrapper.html().length).toBeGreaterThan(100);
  });
});

describe('Password.vue render', () => {
  it('renders the password form with new-password and confirm inputs', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = getKcContextMock({ pageId: 'password.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Password, {
      props: {
        kcContext: kcContext as any,
        i18n: i18n.value as any,
        Template: Template as any,
        doUseDefaultCss: false,
        classes: {},
      },
    });

    await flushPromises();
    await nextTick();
    await flushPromises();

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[name="password-new"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password-confirm"]').exists()).toBe(true);
    expect(wrapper.html().length).toBeGreaterThan(100);
  });
});
