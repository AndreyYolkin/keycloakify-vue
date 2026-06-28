import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/delete-credential.ftl',
  component: KcPageStory,
  args: { pageId: 'delete-credential.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomCredentialLabel: Story = {
  args: {
    kcContext: {
      credentialLabel: 'Test Credential',
      url: { loginAction: '/login-action' },
    },
  },
};
