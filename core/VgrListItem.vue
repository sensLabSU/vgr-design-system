<script setup lang="ts">
const props = defineProps<{
  'col1:class'?: string;
  'col2:class'?: string;
  'end:class'?: string;
}>();
</script>

<template>
  <li class="
    relative flex items-center justify-between py-5 [[data-card]>[data-list]>&]:px-5
    [[data-list]>[data-list-item]+&]:border-t [[data-list]>[data-list-item]+&]:border-neutral-80
  " data-list-item>
    <div class="flex-1 flex items-center gap-4" :class="[props['col1:class']]">
      <slot/>
    </div>

    <div v-if="$slots.col2" class="flex-1 flex items-center gap-4" :class="[props['col2:class']]">
      <slot name="col2"/>
    </div>

    <div v-if="$slots.end" class="flex items-center gap-4" :class="[props['end:class']]">
      <slot name="end"/>
    </div>
  </li>
</template>