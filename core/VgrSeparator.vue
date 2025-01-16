<script setup lang="ts">
defineProps<{
  light?: boolean;
}>();
</script>

<template>
  <div class="
    [.vgr-menu>&]:border-t [.vgr-menu>&]:border-current [.vgr-menu>&]:-mx-1 [.vgr-menu>&]:my-1
    [.vgr-stack.horizontal>&]:border-l [.vgr-stack.horizontal>&]:border-current
    [.vgr-stack.vertical>&]:border-t [.vgr-stack.vertical>&]:border-current
    [.vgr-card>&]:border-t [.vgr-card>&]:border-current [.vgr-card>&]:my-5
    [[data-command-palette]_&]:border-t [[data-command-palette]_&]:border-black/10 [[data-command-palette]_&]:my-3 [[data-command-palette]_&]:-mx-1
  " :class="[light ? 'text-white/25' : 'text-black/20']"></div>
</template>