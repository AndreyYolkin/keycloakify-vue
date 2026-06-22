import vue from "@vitejs/plugin-vue";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        vue(),
        keycloakify({
            themeName: "keycloakify-vue-poc",
            accountThemeImplementation: "none"
        })
    ],
});
