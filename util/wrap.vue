<script lang="ts" setup>
defineProps<{
  is: any;
}>();
</script>

<template>
  <template v-if="is">
    <component :is="is">
      <slot/>
    </component>
  </template>
  <template v-else>
    <slot/>
  </template>
</template>