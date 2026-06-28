import type { Meta, StoryObj } from "@storybook/vue3-vite";
import KcPageStory from "../KcPageStory.vue";

const meta = {
    title: "login/register.ftl",
    component: KcPageStory,
    args: { pageId: "register.ftl" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPasswordField: Story = {
    args: { kcContext: { passwordRequired: false } }
};

export const WithEmailAlreadyExists: Story = {
    args: {
        kcContext: {
            profile: {
                attributesByName: {
                    email: {
                        value: "max.mustermann@mail.com"
                    }
                }
            },
            messagesPerField: {
                existsError: (fieldName: string) => fieldName === "email",
                get: (fieldName: string) => (fieldName === "email" ? "Email already exists." : "")
            }
        }
    }
};

export const WithRecaptcha: Story = {
    args: {
        kcContext: {
            recaptchaRequired: true,
            recaptchaVisible: true,
            recaptchaSiteKey: "6LfQHvApAAAAAA"
        }
    }
};

export const WithTermsAcceptance: Story = {
    args: {
        kcContext: {
            termsAcceptanceRequired: true
        }
    }
};

export const WithRestrictedToMITStudents: Story = {
    args: {
        kcContext: {
            profile: {
                attributesByName: {
                    email: {
                        validators: {
                            pattern: {
                                pattern: "^[^@]+@([^.]+\\.)*((mit\\.edu)|(berkeley\\.edu))$",
                                "error-message": "${profile.attributes.email.pattern.error}"
                            }
                        },
                        annotations: {
                            inputHelperTextBefore: "Only students from the MIT or Berkeley are allowed to register"
                        }
                    }
                }
            }
        }
    }
};
