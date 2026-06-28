import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/update-email.ftl",
    component: KcPageStory,
    args: { pageId: "update-email.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAppInitiatedAction: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            messagesPerField: {
                exists: () => false
            },
            isAppInitiatedAction: true
        }
    }
};
