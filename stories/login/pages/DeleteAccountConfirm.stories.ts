import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/delete-account-confirm.ftl",
    component: KcPageStory,
    args: { pageId: "delete-account-confirm.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAIAFlow: Story = {
    args: {
        kcContext: {
            triggered_from_aia: true,
            url: { loginAction: "/login-action" }
        }
    }
};

export const WithoutAIAFlow: Story = {
    args: {
        kcContext: {
            triggered_from_aia: false,
            url: { loginAction: "/login-action" }
        }
    }
};
