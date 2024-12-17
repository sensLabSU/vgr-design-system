<script setup lang="ts">
import {Color} from "../types";
import {resolveColor} from "../util";

const props = defineProps<{
  sticky?: boolean;
  color?: null | Color;
}>();

const colors = {
  healthcare: 'bg-healthcare text-white',
  culture: 'bg-culture text-white',
  education: 'bg-education text-white',
  base: 'bg-base text-white',
  neutral: 'bg-neutral text-white',
  error: 'bg-error-40 text-white',
  purple: 'bg-purple-40 text-white',
  brown: 'bg-brown-40 text-white',
  cyan: 'bg-cyan-40 text-white',
  green: 'bg-green-40 text-white',
  lime: 'bg-lime-40 text-white',
  orange: 'bg-orange-40 text-white',
  pink: 'bg-pink-40 text-white',
  yellow: 'bg-yellow-40 text-white',
  white: 'bg-white text-black',
  black: 'bg-black text-white',
};
</script>

<template>
  <nav class="vgr-navbar w-full p-5 relative z-1 flex items-center gap-4" :class="[
      colors[resolveColor(color)],
      {'sticky top-0 z-10': sticky},
  ]">
    <slot/>
    <!-- Shadow -->
    <div class="absolute top-full inset-x-0 h-3 bg-gradient-to-b from-black/10 to-transparent z-0"></div>
  </nav>
</template>