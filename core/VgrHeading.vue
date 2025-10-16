<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  level?: '1'|'2'|'3'|'4'|'5'|'6';
}>();

const is = computed(() => {
  if(props.level) return `h${props.level}`;
  return 'div';
});

const classes = computed(() => {
  switch(props.level) {
    case '1': return 'text-3xl font-light';
    case '2': return 'text-2xl font-light';
    case '3': return 'text-xl font-light';
    case '4': return 'text-lg font-light';
    case '6': return 'text-sm font-light';
    default: return 'font-light';
  }
});
</script>

<template>
  <component :is="is" :class="[classes]" data-heading>
    <slot/>
  </component>
</template>