<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  id?: string;
  color?: string,
}>();

const model = defineModel();

const classes = computed(() => {
  switch(props.color) {
    case "primary":
    case "healthcare":
    default: return 'bg-healthcare dark:bg-healthcare-50';
    case "secondary":
    case "culture": return 'bg-culture dark:bg-culture-50';
    case "tertiary":
    case "education": return 'bg-education dark:bg-education-50';
    case "base": return 'bg-base';
    case "neutral": return 'bg-neutral';
    case "error": return 'bg-error dark:bg-error-50';
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
    case "white": return 'bg-neutral-95 dark:bg-neutral-90';
  }
});
</script>

<template>
  <label class="inline-block w-11 h-6 p-0.5 rounded-full shadow-inner relative [&:not(:has(:checked))]:!bg-black/15 dark:[&:not(:has(:checked))]:!bg-white/20 transition-colors"
         :class="[classes]" data-toggle>
    <input type="checkbox" class="pointer-events-none peer absolute opacity-0" v-model="model" :id="id ?? undefined">
    <span class="block size-5 rounded-full bg-white ml-0 peer-checked:ml-5 transition-all shadow-sm"></span>
  </label>
</template>