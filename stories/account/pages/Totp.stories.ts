import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/totp.ftl',
  component: KcPageStory,
  args: { pageId: 'totp.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Manual: Story = {
  args: {
    kcContext: {
      mode: 'manual',
    },
  },
};

export const Enabled: Story = {
  args: {
    kcContext: {
      totp: {
        enabled: true,
        otpCredentials: [{ id: 'cred1', userLabel: 'My Phone' }],
      },
    },
  },
};
