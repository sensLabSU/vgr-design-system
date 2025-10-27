<script setup lang="ts">
import {provide} from "vue";

const props = defineProps<{
  variant?: null | 'default' | 'reversed';
  exclusive?: boolean;
  transition?: boolean;
}>();

provide('name', props.exclusive ? `vgr-accordion-${crypto.randomUUID()}` : null);
</script>

<template>
<div class="w-full"
     data-accordion :data-reversed="variant === 'reversed' ? true : null"
     :data-exclusive="exclusive ? true : null"
     :data-transition="transition ? true : null"
>
  <slot/>
</div>
</template>