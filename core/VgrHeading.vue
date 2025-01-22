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
    case '1': return 'text-2xl';
    case '2': return 'text-xl';
    case '3': return 'text-lg';
    default: return 'text-base';
  }
});
</script>

<template>
  <component :is="is" :class="[classes]">
    <slot/>
  </component>
</template>