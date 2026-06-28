import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/link-idp-action.ftl',
  component: KcPageStory,
  args: { pageId: 'link-idp-action.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kcContext: {
      idpDisplayName: 'GitHub',
      url: { loginAction: '/mock-login-action' },
    },
  },
};

export const DifferentProvider: Story = {
  args: {
    kcContext: {
      idpDisplayName: 'Google',
      url: { loginAction: '/custom-login-action' },
    },
  },
};
