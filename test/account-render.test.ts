import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createGetKcContextMock } from 'keycloakify/account/KcContext';
import Account from '../src/account/pages/Account.vue';
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
