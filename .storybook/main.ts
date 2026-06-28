import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|ts)"],
    addons: ["@storybook/addon-docs"],
    framework: {
        name: "@storybook/vue3-vite",
        options: {}
    },
    // Serve PatternFly CSS + Keycloak scripts in `storybook dev` only, so
    // Template's `isReadyToRender` gate (which waits on stylesheet `load`
    // events) passes. Excluded from `build-storybook` to avoid the plugin's
    // theme-build hooks running during a static build.
    viteFinal: async (viteConfig, { configType }) => {
        if (configType === "DEVELOPMENT") {
            const { keycloakify } = await import("keycloakify/vite-plugin");
            viteConfig.plugins = [
                ...(viteConfig.plugins ?? []),
                keycloakify({ themeName: "keycloakify-vue", accountThemeImplementation: "none" })
            ];
        }
        return viteConfig;
    }
};

export default config;
