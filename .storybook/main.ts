import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  // NOTE: the keycloakify vite-plugin is intentionally NOT added here. Its dev
  // hooks expect a consumer app (entry html / dist) and hang in a pure library
  // Storybook. Pages render via `doUseDefaultCss: false` (see stories KcPage).
  // Fully-styled stories run from keycloakify-starter-vue with the plugin (Phase D).
};

export default config;
