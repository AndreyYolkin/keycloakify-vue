import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-reset-password.ftl',
  component: KcPageStory,
  args: { pageId: 'login-reset-password.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmailAsUsername: Story = {
  args: {
    kcContext: {
      realm: {
        loginWithEmailAllowed: true,
        registrationEmailAsUsername: true,
      },
    },
  },
};

export const WithUsernameError: Story = {
  args: {
    kcContext: {
      realm: {
        loginWithEmailAllowed: false,
        registrationEmailAsUsername: false,
        duplicateEmailsAllowed: false,
      },
      url: {
        loginAction: '/mock-login-action',
        loginUrl: '/mock-login-url',
      },
      messagesPerField: {
        existsError: (field: string, ...otherFields: string[]) => [field, ...otherFields].includes('username'),
        get: (field: string) => (field === 'username' ? 'Invalid username' : ''),
      },
      auth: {
        attemptedUsername: 'invalid_user',
      },
    },
  },
};
