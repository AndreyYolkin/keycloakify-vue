import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-x509-info.ftl',
  component: KcPageStory,
  args: { pageId: 'login-x509-info.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutUserEnabled: Story = {
  args: {
    kcContext: {
      url: { loginAction: '/mock-login-action' },
      x509: {
        formData: {
          subjectDN: 'CN=John Doe, OU=Example Org, O=Example Inc, C=US',
          username: 'johndoe',
          isUserEnabled: false,
        },
      },
    },
  },
};
