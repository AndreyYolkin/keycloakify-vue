import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-idp-link-email.ftl',
  component: KcPageStory,
  args: { pageId: 'login-idp-link-email.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kcContext: {
      url: { loginAction: '/login-action' },
      idpAlias: 'mockIdpAlias',
      brokerContext: { username: 'mockUser' },
      realm: { displayName: 'MockRealm' },
    },
  },
};

export const WithIdpAlias: Story = {
  args: {
    kcContext: {
      url: { loginAction: '/login-action' },
      idpAlias: 'Google',
      brokerContext: { username: 'john.doe' },
      realm: { displayName: 'MyRealm' },
    },
  },
};

export const WithCustomRealmDisplayName: Story = {
  args: {
    kcContext: {
      url: { loginAction: '/login-action' },
      idpAlias: 'Facebook',
      brokerContext: { username: 'jane.doe' },
      realm: { displayName: 'CUSTOM REALM DISPLAY NAME' },
    },
  },
};

export const WithFormSubmissionError: Story = {
  args: {
    kcContext: {
      url: { loginAction: '/error' },
      idpAlias: 'mockIdpAlias',
      brokerContext: { username: 'mockUser' },
      realm: { displayName: 'MockRealm' },
      message: {
        type: 'error',
        summary: 'An error occurred during form submission.',
      },
    },
  },
};
