import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/info.ftl',
  component: KcPageStory,
  args: { pageId: 'info.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Server info message',
      },
    },
  },
};

export const WithLinkBack: Story = {
  args: {
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Server message',
      },
      actionUri: undefined,
    },
  },
};

export const WithRequiredActions: Story = {
  args: {
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Required actions: ',
      },
      requiredActions: ['CONFIGURE_TOTP', 'UPDATE_PROFILE', 'VERIFY_EMAIL', 'CUSTOM_ACTION'],
      'x-keycloakify': {
        messages: {
          'requiredAction.CUSTOM_ACTION': 'Custom action',
        },
      },
    },
  },
};
