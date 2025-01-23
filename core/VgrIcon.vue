<script setup lang="ts">
import {computed, ComputedRef} from "vue";

const props = defineProps<{
  icon: string | object;
}>();

const svg: ComputedRef<string|null> = computed((): string|null => {
  if(typeof props.icon !== 'string') return null;

  let url = props.icon.replace(/data:image\/svg\+xml(;base64)?,/, '');

  return props.icon.indexOf('xml;base64,') >= 0 ? atob(url) : decodeURI(url);
});
</script>

<template>
  <!-- SVG -->
  <template v-if="svg">
    <i class="inline-block shrink-0 align-middle *:block *:size-full" v-html="svg" data-icon></i>
  </template>

  <!-- Component -->
  <template v-else>
    <i class="inline-block align-middle shrink-0" data-icon>
      <component :is="icon" class="size-full"/>
    </i>
  </template>
</template>