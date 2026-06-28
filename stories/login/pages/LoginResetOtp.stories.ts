import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-reset-otp.ftl',
  component: KcPageStory,
  args: { pageId: 'login-reset-otp.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutOtpCredentials: Story = {
  args: {
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [],
        selectedCredentialId: undefined,
      },
      messagesPerField: {
        existsError: () => false,
      },
    },
  },
};

export const WithOtpError: Story = {
  args: {
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [
          { id: 'otp1', userLabel: 'Device 1' },
          { id: 'otp2', userLabel: 'Device 2' },
        ],
        selectedCredentialId: 'otp1',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'totp',
        get: () => 'Invalid OTP selection',
      },
    },
  },
};

export const WithOnlyOneOtpCredential: Story = {
  args: {
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [{ id: 'otp1', userLabel: 'Device 1' }],
        selectedCredentialId: 'otp1',
      },
      messagesPerField: {
        existsError: () => false,
      },
    },
  },
};
