import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/log.ftl',
  component: KcPageStory,
  args: { pageId: 'log.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEvents: Story = {
  args: {
    kcContext: {
      log: {
        events: [
          {
            date: new Date('2024-01-15T10:30:00Z').getTime(),
            event: 'LOGIN',
            ipAddress: '192.168.1.100',
            client: 'my-app',
            details: [
              { key: 'auth_method', value: 'openid-connect' },
              { key: 'token_id', value: 'abc123' },
            ],
          },
          {
            date: new Date('2024-01-14T08:15:00Z').getTime(),
            event: 'LOGOUT',
            ipAddress: '192.168.1.101',
            client: 'another-app',
            details: [],
          },
        ],
      },
    },
  },
};
