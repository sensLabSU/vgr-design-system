<script setup lang="ts">
import {computed, inject, onMounted, provide, useSlots} from "vue";

const props = defineProps<{
  variant?: 'default' | 'pills' | 'bar' | 'segmented';
}>();

const slots = useSlots();
const model = defineModel({type: String, default: null});
const onTabChanged = inject('on-tab-changed', () => {});

onMounted(() => {
  if(!model.value) {
    model.value = slots.default()?.[0]?.props.name;
  }

  onTabChanged(model.value);
});

const classes = computed(() => {
  const cls = ['[[data-tab-group]>&:has(+*)]:mb-5'];

  switch(props.variant) {
    case 'bar':
      cls.push('items-stretch justify-center gap-px bg-neutral-90 mx-auto rounded-lg overflow-hidden shadow'); break;
    case 'pills':
      cls.push('items-center justify-center gap-4'); break;
    case 'segmented':
      cls.push('items-stretch justify-center p-1 mx-auto bg-neutral-90 rounded-lg'); break;
    default:
      cls.push('[[data-card]_&]:px-5 items-stretch gap-8 justify-start border-b border-b-neutral-80'); break;
  }

  return cls.join(' ');
});

function activateTab(name) {
  model.value = name;
  onTabChanged(name);
}

provide('variant', props.variant);
provide('active-tab', model);
provide('activate-tab', activateTab);
</script>

<template>
  <div class="flex" :class="[classes]" data-tabs>
    <slot/>
  </div>
</template>