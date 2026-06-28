import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/frontchannel-logout.ftl',
  component: KcPageStory,
  args: { pageId: 'frontchannel-logout.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutRedirectUrl: Story = {
  args: {
    kcContext: {
      logout: {
        clients: [],
      },
    },
  },
};
