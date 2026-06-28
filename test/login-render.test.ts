import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createGetKcContextMock } from 'keycloakify/login/KcContext';
import Login from '../src/login/pages/Login.vue';
import Template from '../src/login/Template.vue';
import { i18nBuilder } from '../src/login/i18n/i18nBuilder';

describe('Login.vue render', () => {
  it('renders the login form (username, password, submit)', async () => {
    const { getKcContextMock } = createGetKcContextMock({
      kcContextExtension: { themeName: 'keycloakify-vue', properties: {} },
      kcContextExtensionPerPage: {},
      overrides: {},
    });
    const kcContext = getKcContextMock({ pageId: 'login.ftl' });

    const { useI18n } = i18nBuilder.build();
    const { i18n } = useI18n({ kcContext: kcContext as any });

    const wrapper = mount(Login, {
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
    expect(wrapper.find('#kc-form-login').exists()).toBe(true);
    expect(wrapper.find('input[name="username"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    expect(wrapper.find('#kc-login').exists()).toBe(true);
    // sanity: the title/header rendered something
    expect(html.length).toBeGreaterThan(200);
  });
});
