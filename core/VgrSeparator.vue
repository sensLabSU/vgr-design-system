<script setup lang="ts">
defineProps<{
  light?: boolean;
}>();
</script>

<template>
  <div class="
    border-current border-t
    [[data-menu]>&]:-mx-1 [[data-menu]>&]:my-1
    [[data-stack].horizontal>&]:border-l [[data-stack].horizontal>&]:border-t-0
    [[data-card]>&]:my-5
    [[data-command-palette]_&]:my-3 [[data-command-palette]_&]:-mx-2
  " :class="[light ? 'text-white/25 dark:text-black/25' : 'text-black/20 dark:text-white/20']" data-separator></div>
</template>