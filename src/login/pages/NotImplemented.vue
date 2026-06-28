<script setup lang="ts">
const props = defineProps<{ pageId: string }>();
</script>

<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>Not implemented yet</h1>
    <p>
      Page <code>{{ props.pageId }}</code> does not have a Vue implementation
      yet.
    </p>
  </div>
</template>
