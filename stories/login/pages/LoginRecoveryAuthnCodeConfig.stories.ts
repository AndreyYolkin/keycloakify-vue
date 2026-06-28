import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-recovery-authn-code-config.ftl",
    component: KcPageStory,
    args: { pageId: "login-recovery-authn-code-config.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrorDuringCodeGeneration: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            message: {
                summary: "An error occurred during recovery code generation. Please try again.",
                type: "error"
            }
        }
    }
};
