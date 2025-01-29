<script setup lang="ts">
const props = defineProps<{
  stickLeft?: number;
  width?: number;
}>();
</script>

<template>
  <td class="" :class="{
    'sticky z-1 after:content-[\'\'] after:absolute after:left-full after:inset-y-0 after:w-px after:bg-neutral-90': stickLeft !== undefined,
  }" :style="{
    width: width ? width+'px' : 'auto',
    minWidth: width ? width+'px' : 'auto',
    maxWidth: width ? width+'px' : 'auto',
    left: stickLeft !== undefined ? stickLeft + 'px' : 'auto',
  }">
    <slot/>
  </td>
</template>