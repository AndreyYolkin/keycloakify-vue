<script setup lang="ts">
const props = defineProps<{ pageId: string }>();
</script>

<template>
    <div style="padding: 2rem; font-family: sans-serif">
        <h1>Not implemented in this PoC</h1>
        <p>Page <code>{{ props.pageId }}</code> has no Vue implementation yet. Only <code>login.ftl</code> is wired.</p>
    </div>
</template>
