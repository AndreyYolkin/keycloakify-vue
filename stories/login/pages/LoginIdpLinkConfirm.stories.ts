import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-idp-link-confirm.ftl",
    component: KcPageStory,
    args: { pageId: "login-idp-link-confirm.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        kcContext: {
            url: { loginAction: "/login-action" },
            idpAlias: "mockIdpAlias"
        }
    }
};

export const WithFormSubmissionError: Story = {
    args: {
        kcContext: {
            url: { loginAction: "/error" },
            idpAlias: "mockIdpAlias",
            message: {
                type: "error",
                summary: "An error occurred during form submission."
            }
        }
    }
};
