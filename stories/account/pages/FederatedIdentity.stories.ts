import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/federatedIdentity.ftl',
  component: KcPageStory,
  args: { pageId: 'federatedIdentity.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConnectedAndUnconnected: Story = {
  args: {
    kcContext: {
      federatedIdentity: {
        identities: [
          {
            providerId: 'google',
            displayName: 'Google',
            userName: 'john.doe@gmail.com',
            connected: true,
          },
          {
            providerId: 'github',
            displayName: 'GitHub',
            userName: '',
            connected: false,
          },
        ],
        removeLinkPossible: true,
      },
      stateChecker: 'test-state-checker',
      url: {
        socialUrl: '/social',
      },
    },
  },
};

export const RemoveLinkNotPossible: Story = {
  args: {
    kcContext: {
      federatedIdentity: {
        identities: [
          {
            providerId: 'google',
            displayName: 'Google',
            userName: 'john.doe@gmail.com',
            connected: true,
          },
        ],
        removeLinkPossible: false,
      },
      stateChecker: 'test-state-checker',
      url: {
        socialUrl: '/social',
      },
    },
  },
};
