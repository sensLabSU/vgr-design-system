<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  color?: string,
}>();

const model = defineModel();

const classes = computed(() => {
  switch(props.color) {
    case "primary":
    case "healthcare":
    default: return 'bg-healthcare';
    case "secondary":
    case "culture": return 'bg-culture';
    case "tertiary":
    case "education": return 'bg-education';
    case "base": return 'bg-base';
    case "neutral": return 'bg-neutral';
    case "error": return 'bg-error';
    case "purple": return 'bg-purple';
    case "brown": return 'bg-brown';
    case "cyan": return 'bg-cyan';
    case "green": return 'bg-green';
    case "lime": return 'bg-lime';
    case "orange": return 'bg-orange';
    case "pink": return 'bg-pink';
    case "yellow": return 'bg-yellow';
    case "blue": return 'bg-blue';
    case "black": return 'bg-black';
    case "white": return 'bg-white';
  }
});
</script>

<template>
  <label class="inline-block w-11 h-6 p-0.5 rounded-full shadow-inner relative [&:not(:has(:checked))]:!bg-black/15 transition-colors"
         :class="[classes]" data-toggle>
    <input type="checkbox" class="pointer-events-none peer absolute opacity-0" v-model="model">
    <span class="block size-5 rounded-full bg-white ml-0 peer-checked:ml-5 transition-all shadow-sm"></span>
  </label>
</template>