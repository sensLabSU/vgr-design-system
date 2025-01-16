<script setup lang="ts">
defineProps<{
  light?: boolean;
}>();
</script>

<template>
  <div class="
    border-current border-t
    [.vgr-menu>&]:-mx-1 [.vgr-menu>&]:my-1
    [.vgr-stack.horizontal>&]:border-l [.vgr-stack.horizontal>&]:border-t-0
    [.vgr-card>&]:my-5
    [[data-command-palette]_&]:my-3 [[data-command-palette]_&]:-mx-2
  " :class="[light ? 'text-white/25' : 'text-black/20']"></div>
</template>