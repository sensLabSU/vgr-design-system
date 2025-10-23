<script setup lang="ts">
import {provide, Ref, ref} from "vue";

const props = defineProps<{
  variant?: null | 'default' | 'reversed';
  exclusive?: boolean;
}>();

const accordion: Ref<HTMLDivElement> = ref(null as unknown as HTMLDivElement);

provide('onItemOpen', (item: HTMLDetailsElement) => {
  if(!props.exclusive) return;

  [...accordion.value.querySelectorAll('details[open]')]
    .filter(i => i !== item)
    .forEach((i: Element) => {
      (i as HTMLDetailsElement).open = false;
    });
});
</script>

<template>
<div ref="accordion" class="w-full" data-accordion :data-reversed="variant === 'reversed' ? true : null" :data-exclusive="exclusive ? true : null">
  <slot/>
</div>
</template>