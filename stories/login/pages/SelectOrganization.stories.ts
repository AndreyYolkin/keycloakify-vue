import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/select-organization.ftl',
  component: KcPageStory,
  args: { pageId: 'select-organization.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMultipleOrganizations: Story = {
  args: {
    kcContext: {
      user: {
        organizations: [
          { alias: 'acme', name: 'Acme Corp' },
          { alias: 'globex', name: 'Globex Corporation' },
          { alias: 'initech', name: 'Initech' },
        ],
      },
    },
  },
};

export const WithGridLayout: Story = {
  args: {
    kcContext: {
      user: {
        organizations: [
          { alias: 'acme', name: 'Acme Corp' },
          { alias: 'globex', name: 'Globex Corporation' },
          { alias: 'initech', name: 'Initech' },
          { alias: 'umbrella', name: 'Umbrella Corp' },
        ],
      },
    },
  },
};

export const WithAliasAsFallbackName: Story = {
  args: {
    kcContext: {
      user: {
        organizations: [{ alias: 'my-org' }, { alias: 'another-org', name: 'Another Org' }],
      },
    },
  },
};

export const WithNoOrganizations: Story = {
  args: {
    kcContext: {
      user: {
        organizations: [],
      },
    },
  },
};
