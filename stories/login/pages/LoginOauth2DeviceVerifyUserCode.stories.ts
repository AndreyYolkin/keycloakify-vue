import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-oauth2-device-verify-user-code.ftl",
    component: KcPageStory,
    args: { pageId: "login-oauth2-device-verify-user-code.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrorMessage: Story = {
    args: {
        kcContext: {
            url: {
                oauth2DeviceVerificationAction: "/mock-oauth2-device-verification"
            },
            message: {
                summary: "The user code you entered is invalid. Please try again.",
                type: "error"
            }
        }
    }
};

export const WithEmptyInputField: Story = {
    args: {
        kcContext: {
            url: {
                oauth2DeviceVerificationAction: "/mock-oauth2-device-verification"
            },
            message: {
                summary: "User code cannot be empty. Please enter a valid code.",
                type: "error"
            }
        }
    }
};
