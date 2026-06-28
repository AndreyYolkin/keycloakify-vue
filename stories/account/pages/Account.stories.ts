import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/account.ftl',
  component: KcPageStory,
  args: { pageId: 'account.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithReferrer: Story = {
  args: {
    kcContext: {
      referrer: { url: '#', name: 'myApp' },
    },
  },
};
