import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/password.ftl',
  component: KcPageStory,
  args: { pageId: 'password.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PasswordNotSet: Story = {
  args: {
    kcContext: {
      password: { passwordSet: false },
    },
  },
};
