import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-update-profile.ftl',
  component: KcPageStory,
  args: { pageId: 'login-update-profile.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Demo: Story = {
  args: {
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'email',
        get: () => 'Invalid email format',
      },
      isAppInitiatedAction: false,
    },
  },
};
