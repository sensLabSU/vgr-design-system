<script setup lang="ts">
import {VgrStack} from "./index";

defineProps<{
  adjustBorders?: boolean;
  keepCorners?: boolean;
}>();
</script>

<template>
  <vgr-stack horizontal gap="none"
             :class="{
                '[&:not(:first-child)]:*:!rounded-l-none [&:not(:last-child)]:*:!rounded-r-none': !keepCorners,
                '[&:not(:first-child)]:*:border-l [&:not(:last-child)]:*:border-r': adjustBorders,
             }"
  >
    <slot/>
  </vgr-stack>
</template>