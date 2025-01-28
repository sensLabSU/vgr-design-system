<script setup lang="ts">
import {computed, ComputedRef} from "vue";

const props = defineProps<{
  horizontal?: boolean;
  gap?: null | 'none' | 'x-small' | 'small' | 'default' | 'normal' | 'large' | 'x-large';
  align?: null | 'default' | 'left' | 'start' | 'center' | 'middle' | 'right' | 'end';
}>();

const classes: ComputedRef<string> = computed((): string => {
  const cls = [];

  switch(props.gap) {
    case 'none': break;
    case 'x-small': cls.push('gap-1'); break;
    case 'small': cls.push('gap-2'); break;
    case 'large': cls.push('gap-8'); break;
    case 'x-large': cls.push('gap-12'); break;
    case 'default':
    case 'normal':
    default:
      cls.push('gap-4'); break;
  }

  switch(props.align) {
    case 'left':
    case 'start':
      cls.push('justify-start');
      break;
    case 'right':
    case 'end':
      cls.push('justify-end');
      break;
    default:
      cls.push('justify-center');
      break;
  }

  if(!props.horizontal) {
    cls.push('flex-col');
  }

  return cls.join(' ');
})
</script>

<template>
  <div class="flex" :class="[classes, horizontal ? 'horizontal' : 'vertical']" data-stack>
    <slot/>
  </div>
</template>