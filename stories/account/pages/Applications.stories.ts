import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'account/applications.ftl',
  component: KcPageStory,
  args: { pageId: 'applications.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithConsentedScopes: Story = {
  args: {
    kcContext: {
      applications: {
        applications: [
          {
            realmRolesAvailable: [
              {
                name: 'realmRoleName1',
                description: 'realm role description 1',
              },
              {
                name: 'realmRoleName2',
                description: 'realm role description 2',
              },
            ],
            resourceRolesAvailable: {
              resource1: [
                {
                  roleName: 'Resource Role Name 1',
                  roleDescription: 'Resource role 1 description',
                  clientName: 'Client Name 1',
                  clientId: 'client1',
                },
              ],
            },
            additionalGrants: ['offline_access'],
            clientScopesGranted: ['openid', 'profile', 'email'],
            effectiveUrl: '#',
            client: {
              clientId: 'my-app',
              name: 'My Application',
              consentRequired: true,
              id: 'my-app-id',
            },
          },
          {
            realmRolesAvailable: [],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'another-app',
              name: 'Another Application',
              consentRequired: false,
              id: 'another-app-id',
            },
          },
        ],
      },
      stateChecker: 'test-state-checker',
    },
  },
};
