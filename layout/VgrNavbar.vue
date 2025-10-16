<script setup lang="ts">
import {computed} from "vue";
import {resolveColor} from "../util";

const props = defineProps<{
  sticky?: boolean;
  color?: null | string;
}>();

const colors = {
  healthcare: 'bg-healthcare text-white dark:bg-healthcare-30',
  culture: 'bg-culture text-white dark:bg-culture-30',
  education: 'bg-education text-white dark:bg-education-30',
  base: 'bg-base text-white dark:bg-base-30',
  neutral: 'bg-neutral text-white dark:bg-neutral-30',
  error: 'bg-error-40 text-white dark:bg-error-30',
  purple: 'bg-purple-40 text-white dark:bg-purple-30',
  brown: 'bg-brown-40 text-white dark:bg-brown-30',
  cyan: 'bg-cyan-40 text-white dark:bg-cyan-30',
  green: 'bg-green-40 text-white dark:bg-green-30',
  lime: 'bg-lime-40 text-white dark:bg-lime-30',
  orange: 'bg-orange-40 text-white dark:bg-orange-30',
  pink: 'bg-pink-40 text-white dark:bg-pink-30',
  yellow: 'bg-yellow-40 text-white dark:bg-yellow-30',
  blue: 'bg-blue-40 text-white dark:bg-blue-30',
  white: 'bg-white text-black',
  black: 'bg-black text-white',
};

const calculatedColor = computed(() => {
  const resolved = resolveColor(props.color || null);
  if(typeof resolved === 'object') return resolved.bg;

  return (colors as any)[resolved];
})

</script>

<template>
  <nav class="w-full p-5 relative z-50 flex items-center gap-4" data-navbar :class="[
      calculatedColor,
      {'sticky top-0 z-10': sticky},
  ]">
    <slot/>
    <!-- Shadow -->
    <div class="absolute top-full inset-x-0 h-3 bg-gradient-to-b from-black/10 to-transparent z-0"></div>
  </nav>
</template>