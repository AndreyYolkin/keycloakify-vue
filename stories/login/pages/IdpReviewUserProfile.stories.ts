import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/idp-review-user-profile.ftl",
    component: KcPageStory,
    args: { pageId: "idp-review-user-profile.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFormValidationErrors: Story = {
    args: {
        kcContext: {
            messagesPerField: {
                existsError: (fieldName: string) => ["email", "firstName"].includes(fieldName),
                get: (fieldName: string) => {
                    if (fieldName === "email") return "Invalid email format.";
                    if (fieldName === "firstName") return "First name is required.";
                    return "";
                }
            }
        }
    }
};

export const WithReadOnlyFields: Story = {
    args: {
        kcContext: {
            profile: {
                attributesByName: {
                    email: { value: "jane.doe@example.com", readOnly: true },
                    firstName: { value: "Jane", readOnly: false }
                }
            }
        }
    }
};

export const WithPrefilledFormFields: Story = {
    args: {
        kcContext: {
            profile: {
                attributesByName: {
                    firstName: { value: "Jane" },
                    lastName: { value: "Doe" },
                    email: { value: "jane.doe@example.com" }
                }
            }
        }
    }
};
