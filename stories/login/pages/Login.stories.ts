import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login.ftl',
  component: KcPageStory,
  args: { pageId: 'login.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInvalidCredential: Story = {
  args: {
    kcContext: {
      login: { username: 'johndoe' },
      messagesPerField: {
        existsError: (fieldName: string, ...otherFieldNames: string[]) => {
          const fieldNames = [fieldName, ...otherFieldNames];
          return fieldNames.includes('username') || fieldNames.includes('password');
        },
        get: (fieldName: string) =>
          fieldName === 'username' || fieldName === 'password' ? 'Invalid username or password.' : '',
      },
    },
  },
};

export const WithoutRegistration: Story = {
  args: { kcContext: { realm: { registrationAllowed: false } } },
};

export const WithoutRememberMe: Story = {
  args: { kcContext: { realm: { rememberMe: false } } },
};

export const WithSocialProviders: Story = {
  args: {
    kcContext: {
      social: {
        displayInfo: true,
        providers: [
          {
            loginUrl: 'google',
            alias: 'google',
            providerId: 'google',
            displayName: 'Google',
            iconClasses: 'fa fa-google',
          },
          {
            loginUrl: 'microsoft',
            alias: 'microsoft',
            providerId: 'microsoft',
            displayName: 'Microsoft',
            iconClasses: 'fa fa-windows',
          },
        ],
      },
    },
  },
};

export const WithErrorMessage: Story = {
  args: {
    kcContext: {
      message: {
        type: 'error',
        summary:
          'The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.',
      },
    },
  },
};
