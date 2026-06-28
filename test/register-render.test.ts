import { mount, flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { createGetKcContextMock } from "keycloakify/login/KcContext";
import Register from "../src/login/pages/Register.vue";
import Template from "../src/login/Template.vue";
import UserProfileFormFields from "../src/login/components/UserProfileFormFields.vue";
import { i18nBuilder } from "../src/login/i18n/i18nBuilder";

describe("Register.vue render", () => {
    it("renders the registration form with user-profile fields", async () => {
        const { getKcContextMock } = createGetKcContextMock({
            kcContextExtension: { themeName: "keycloakify-vue", properties: {} },
            kcContextExtensionPerPage: {},
            overrides: {}
        });
        const kcContext = getKcContextMock({ pageId: "register.ftl" });

        const { useI18n } = i18nBuilder.build();
        const { i18n } = useI18n({ kcContext: kcContext as any });

        const wrapper = mount(Register, {
            props: {
                kcContext: kcContext as any,
                i18n: i18n.value as any,
                Template: Template as any,
                UserProfileFormFields: UserProfileFormFields as any,
                doUseDefaultCss: false,
                doMakeUserConfirmPassword: true,
                classes: {}
            }
        });

        await flushPromises();
        await nextTick();
        await flushPromises();

        expect(wrapper.find("#kc-register-form").exists()).toBe(true);
        expect(wrapper.find('input[name="firstName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="lastName"]').exists()).toBe(true);
        expect(wrapper.find('input[name="email"]').exists()).toBe(true);
        // submit button present
        expect(wrapper.find('input[type="submit"]').exists()).toBe(true);
    });
});
