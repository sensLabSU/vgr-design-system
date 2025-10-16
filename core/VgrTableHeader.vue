<script setup lang="ts">
const props = defineProps<{
  stickLeft?: number;
  stickTop?: boolean;
  width?: number;
}>();
</script>

<template>
  <th class="" :class="[
    stickLeft !== undefined && stickTop ? 'z-20' : (stickLeft !== undefined || stickTop ? 'z-10' : null),
    {
      'sticky': stickLeft !== undefined || stickTop,
      'top-0': stickTop,
      'after:content-[\'\'] after:absolute after:left-full after:inset-y-0 after:w-px after:bg-neutral-90 dark:after:bg-neutral-50': stickLeft !== undefined,
      'before:content-[\'\'] before:absolute before:top-full before:inset-x-0 before:h-px before:bg-neutral-90 dark:before:bg-neutral-50': stickTop,
    }
  ]" :style="{
    width: width ? width+'px' : 'auto',
    minWidth: width ? width+'px' : 'auto',
    maxWidth: width ? width+'px' : 'auto',
    left: stickLeft !== undefined ? stickLeft + 'px' : 'auto',
  }">
    <slot/>
  </th>
</template>