import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/login-oauth-grant.ftl',
  component: KcPageStory,
  args: { pageId: 'login-oauth-grant.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockKcContext = {
  url: {
    oauthAction: '/oauth-action',
  },
  oauth: {
    clientScopesRequested: [
      { consentScreenText: 'Scope1', dynamicScopeParameter: 'dynamicScope1' },
      { consentScreenText: 'Scope2' },
    ],
    code: 'mockCode',
  },
  client: {
    attributes: {
      policyUri: 'https://twitter.com/en/tos',
      tosUri: 'https://twitter.com/en/privacy',
    },
    name: 'Twitter',
    clientId: 'twitter-client-id',
  },
};

export const Default: Story = {
  args: {
    kcContext: mockKcContext,
  },
};

export const WithoutScopes: Story = {
  args: {
    kcContext: {
      ...mockKcContext,
      oauth: {
        ...mockKcContext.oauth,
        clientScopesRequested: [],
      },
    },
  },
};

export const WithFormSubmissionError: Story = {
  args: {
    kcContext: {
      ...mockKcContext,
      url: {
        oauthAction: '/error',
      },
      message: {
        type: 'error',
        summary: 'An error occurred during form submission.',
      },
    },
  },
};

export const WithLogoUri: Story = {
  args: {
    kcContext: {
      ...mockKcContext,
      client: {
        ...mockKcContext.client,
        attributes: {
          ...mockKcContext.client.attributes,
          logoUri:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png',
        },
      },
    },
  },
};

export const WithClientIdInsteadOfName: Story = {
  args: {
    kcContext: {
      ...mockKcContext,
      client: {
        ...mockKcContext.client,
        name: undefined,
        clientId: 'my-client-app',
      },
    },
  },
};
