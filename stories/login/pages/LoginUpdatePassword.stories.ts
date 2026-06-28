import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-update-password.ftl",
    component: KcPageStory,
    args: { pageId: "login-update-password.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPasswordError: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            messagesPerField: {
                existsError: (field: string, ...otherFields: string[]) =>
                    [field, ...otherFields].includes("password"),
                get: (field: string) => (field === "password" ? "Password must be at least 8 characters long." : "")
            },
            isAppInitiatedAction: false
        }
    }
};

export const WithPasswordConfirmError: Story = {
    args: {
        kcContext: {
            url: {
                loginAction: "/mock-login-action"
            },
            messagesPerField: {
                existsError: (field: string, ...otherFields: string[]) =>
                    [field, ...otherFields].includes("password-confirm"),
                get: (field: string) => (field === "password-confirm" ? "Passwords do not match." : "")
            },
            isAppInitiatedAction: false
        }
    }
};

export const WithAppInitiatedAction: Story = {
    args: {
        kcContext: {
            isAppInitiatedAction: true
        }
    }
};
