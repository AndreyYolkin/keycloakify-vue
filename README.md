# @keycloakify/vue

Vue 3 components for building Keycloak login themes with [Keycloakify](https://github.com/keycloakify/keycloakify).

`@keycloakify/vue` is a community Vue 3 port of Keycloakify's UI layer, mirroring the architecture of
[`@keycloakify/svelte`](https://github.com/keycloakify/keycloakify-svelte). It reuses Keycloakify's
framework-agnostic build tooling and core logic via a peer dependency — only the Vue UI layer (layer 3)
is reimplemented here. You write your Keycloak theme in Vue; `keycloakify` handles the build + jar
packaging unchanged.

## Status

| Theme       | Status                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------- |
| **Login**   | **Complete** — all 38 login pages ported, including `register.ftl` / `UserProfileFormFields` |
| **Account** | **Complete** — all 7 classic account pages ported (account, password, sessions, totp, applications, log, federatedIdentity) |
| Admin/Email | Out of scope                                                                                 |

## Installation

```bash
npm install --save-dev @keycloakify/vue
```

**Peer dependencies:** `keycloakify ^11.15.1` and `vue ^3.5.0` must be installed in your project.

The easiest way to get started is the official starter template:

- **[keycloakify-starter-vue](https://github.com/AndreyYolkin/keycloakify-starter-vue)** — a ready-to-use
  Vite + Vue project wired to `@keycloakify/vue`, analogous to
  [`keycloakify-starter-svelte`](https://github.com/keycloakify/keycloakify-starter-svelte).

## What's Included

- **`DefaultPage`** — top-level dispatcher component that routes all 38 login `pageId` values to the
  correct page component.
- **`Template`** — the outer page shell (header, info/error alerts, social providers, language switcher).
- **Per-page components** — importable individually from `@keycloakify/vue/login/pages/*.vue`
  (e.g. `Login.vue`, `Register.vue`, `LoginOtp.vue`, …).
- **`UserProfileFormFields`** — full dynamic user-profile form suite used by `Register`, `LoginUpdateProfile`,
  and `IdpReviewUserProfile`.
- **`i18nBuilder`** — factory for wiring Keycloakify's `noJsx` i18n engine into Vue (returns `msg()` /
  `advancedMsg()` that produce sanitized `VNode`s).
- **Account theme** — importable from `@keycloakify/vue/account`: its own `DefaultPage` + `Template`,
  the 7 account pages at `@keycloakify/vue/account/pages/*.vue`, and an account `i18nBuilder`.
- **`bin` handlers** — `_keycloakify-custom-handler` delegates `update-kc-gen`, `eject-page`,
  `add-story`, and `initialize-account-theme` so the `keycloakify` CLI treats your project as a Vue theme.

## Usage

Clone or scaffold from the [starter](https://github.com/AndreyYolkin/keycloakify-starter-vue) for the
full wiring. At its core a consumer project has a `KcPage.vue` that looks like:

```vue
<script setup lang="ts">
import { DefaultPage } from '@keycloakify/vue';
import type { KcContext } from './KcContext';
import { useI18n } from './i18n';
import Template from '@keycloakify/vue/login/Template.vue';

const props = defineProps<{ kcContext: KcContext }>();
const { i18n } = useI18n({ kcContext: props.kcContext });
</script>

<template>
  <DefaultPage
    :kcContext
    :i18n
    :Template
  />
</template>
```

## How It Works / Relationship to Keycloakify

Keycloakify is built in three layers:

1. **Build tooling / CLI** (`keycloakify/bin`, `keycloakify/vite-plugin`) — framework-agnostic. Reads a
   built SPA, rewrites asset paths to FreeMarker variables, generates `.ftl` templates, packages the
   theme `.jar`.
2. **Core logic** (`KcContext` types, `i18n/noJsx`, `getUserProfileApi`, `kcClsx`, `kcSanitize`) —
   deliberately framework-agnostic.
3. **UI components** — the only framework-coupled layer.

`@keycloakify/vue` reuses layers 1 and 2 unchanged (via the `keycloakify` peer dependency) and
reimplements layer 3 in Vue 3.

**Distribution:** the package ships raw `.vue` single-file components plus `.d.ts` types. Your project's
Vite + `@vitejs/plugin-vue` compiles them — no pre-bundled JS is shipped.

## Contributing

```bash
git clone https://github.com/AndreyYolkin/keycloakify-vue
git clone https://github.com/AndreyYolkin/keycloakify-starter-vue

cd keycloakify-vue
yarn install
yarn link-in-starter   # links the built package into the starter
```

Changes to the library are reflected in the starter after `yarn build` (or `yarn watch`).

Issues and pull requests are welcome at
[github.com/AndreyYolkin/keycloakify-vue](https://github.com/AndreyYolkin/keycloakify-vue).

## License

MIT
