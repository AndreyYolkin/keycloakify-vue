import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KcPageStory from '../KcPageStory.vue';

const meta = {
  title: 'login/code.ftl',
  component: KcPageStory,
  args: { pageId: 'code.ftl' },
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrorCode: Story = {
  args: {
    kcContext: {
      code: {
        success: false,
        error: 'Failed to generate code',
      },
    },
  },
};

export const WithFrenchLanguage: Story = {
  args: {
    kcContext: {
      locale: {
        currentLanguageTag: 'fr',
      },
      code: {
        success: true,
        code: 'XYZ789',
      },
    },
  },
};

export const WithHtmlErrorMessage: Story = {
  args: {
    kcContext: {
      code: {
        success: false,
        error: "Something went wrong. <a href='https://example.com'>Try again</a>",
      },
    },
  },
};
