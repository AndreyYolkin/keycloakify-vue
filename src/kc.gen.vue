<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import type { KcContext } from "./kc.gen";

const props = defineProps<{ kcContext: KcContext }>();

const KcLoginPage = defineAsyncComponent(() => import("./login/KcPage.vue"));
</script>

<template>
    <KcLoginPage v-if="kcContext.themeType === 'login'" :kcContext="kcContext" />
    <!-- account theme not implemented in this PoC -->
</template>
