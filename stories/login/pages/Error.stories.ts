import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/error.ftl',
  component: KcPageStory,
  args: { pageId: 'error.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAnotherMessage: Story = {
  args: {
    kcContext: {
      message: { summary: 'With another error message' },
    },
  },
};

export const WithHtmlErrorMessage: Story = {
  args: {
    kcContext: {
      message: {
        summary: "<strong>Error:</strong> Something went wrong. <a href='https://example.com'>Go back</a>",
      },
    },
  },
};

export const FrenchError: Story = {
  args: {
    kcContext: {
      locale: { currentLanguageTag: 'fr' },
      message: { summary: "Une erreur s'est produite" },
    },
  },
};

export const WithSkipLink: Story = {
  args: {
    kcContext: {
      message: { summary: 'An error occurred' },
      skipLink: true,
      client: {
        baseUrl: 'https://example.com',
      },
    },
  },
};
