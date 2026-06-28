<script setup lang="ts">
import { computed } from 'vue';
import { getKcContextMock, type KcPageStoryProps } from './KcContextMock';
import KcPage from './KcPage.vue';

const props = defineProps<KcPageStoryProps>();

const kcContextMock = computed(() => getKcContextMock({ pageId: props.pageId, overrides: props.kcContext }));
</script>

<template>
  <KcPage :kcContext="kcContextMock" />
</template>
