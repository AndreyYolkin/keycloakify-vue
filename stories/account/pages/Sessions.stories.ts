import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/sessions.ftl',
  component: KcPageStory,
  args: { pageId: 'sessions.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSessions: Story = {
  args: {
    kcContext: {
      sessions: {
        sessions: [
          {
            id: 'session-1',
            ipAddress: '192.168.1.100',
            started: '1/15/2024, 10:30:00 AM',
            lastAccess: '1/15/2024, 11:45:00 AM',
            expires: '1/15/2024, 12:30:00 PM',
            clients: ['my-app', 'another-app'],
          },
          {
            id: 'session-2',
            ipAddress: '10.0.0.5',
            started: '1/14/2024, 9:00:00 AM',
            lastAccess: '1/14/2024, 9:30:00 AM',
            expires: '1/14/2024, 10:00:00 AM',
            clients: ['mobile-app'],
          },
        ],
      },
    },
  },
};
