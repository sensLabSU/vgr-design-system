<script setup lang="ts">
import {provide, Ref, ref} from "vue";

const props = defineProps<{
  variant?: null | 'default' | 'reversed';
  exclusive?: boolean;
}>();

provide('name', props.exclusive ? `vgr-accordion-${crypto.randomUUID()}` : null);
</script>

<template>
<div class="w-full" data-accordion :data-reversed="variant === 'reversed' ? true : null" :data-exclusive="exclusive ? true : null">
  <slot/>
</div>
</template>