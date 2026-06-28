import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/login-password.ftl",
    component: KcPageStory,
    args: { pageId: "login-password.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPasswordError: Story = {
    args: {
        kcContext: {
            realm: {
                resetPasswordAllowed: true
            },
            url: {
                loginAction: "/mock-login",
                loginResetCredentialsUrl: "/mock-reset-password"
            },
            messagesPerField: {
                existsError: (field: string, ...otherFields: string[]) =>
                    [field, ...otherFields].includes("password"),
                get: (field: string) => (field === "password" ? "Invalid password" : "")
            }
        }
    }
};

export const WithoutResetPasswordOption: Story = {
    args: {
        kcContext: {
            realm: {
                resetPasswordAllowed: false
            },
            url: {
                loginAction: "/mock-login",
                loginResetCredentialsUrl: "/mock-reset-password"
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};
