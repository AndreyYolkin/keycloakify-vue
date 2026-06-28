import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-username.ftl',
  component: KcPageStory,
  args: { pageId: 'login-username.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmailAsUsername: Story = {
  args: {
    kcContext: {
      realm: {
        loginWithEmailAllowed: true,
        registrationEmailAsUsername: true,
      },
    },
  },
};
