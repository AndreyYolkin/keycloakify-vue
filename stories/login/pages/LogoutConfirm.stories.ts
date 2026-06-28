import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/logout-confirm.ftl',
  component: KcPageStory,
  args: { pageId: 'logout-confirm.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomLogoutMessage: Story = {
  args: {
    kcContext: {
      url: {
        logoutConfirmAction: '/mock-logout-action',
      },
      client: {
        baseUrl: '/mock-client-url',
      },
      logoutConfirm: {
        code: 'mock-session-code',
        skipLink: false,
      },
      message: {
        summary: 'Are you sure you want to log out from all sessions?',
        type: 'warning',
      },
    },
  },
};
