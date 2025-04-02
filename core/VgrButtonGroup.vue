<script setup lang="ts">
import {VgrStack} from "./index";

defineProps<{
  adjustBorders?: boolean;
  keepCorners?: boolean;
  gap?: null | 'none' | 'x-small' | 'small' | 'default' | 'normal' | 'large' | 'x-large';
}>();
</script>

<template>
  <vgr-stack horizontal :gap="gap || 'none'"
             :class="{
                '[&:not(:first-child)]:*:!rounded-l-none [&:not(:last-child)]:*:!rounded-r-none': !keepCorners,
                '[&:not(:first-child)]:*:border-l [&:not(:last-child)]:*:border-r': adjustBorders,
             }"
             data-button-group
  >
    <slot/>
  </vgr-stack>
</template>