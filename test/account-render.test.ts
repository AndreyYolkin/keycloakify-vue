import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createGetKcContextMock } from 'keycloakify/account/KcContext';
import Account from '../src/account/pages/Account.vue';
import Log from '../src/account/pages/Log.vue';
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
