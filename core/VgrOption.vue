<script setup lang="ts">
const props = defineProps<{
  value: any;
  disabled?: boolean;
  selected?: boolean;
}>();
</script>

<template>
  <option :value="value" :disabled="disabled || null" :selected="selected || null">
    <slot/>
  </option>
</template>