import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-page-expired.ftl",
    component: KcPageStory,
    args: { pageId: "login-page-expired.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrorMessage: Story = {
    args: {
        kcContext: {
            url: {
                loginRestartFlowUrl: "/mock-restart-flow",
                loginAction: "/mock-continue-login"
            },
            message: {
                type: "error",
                summary: "An error occurred while processing your session."
            }
        }
    }
};
