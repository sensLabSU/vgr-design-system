<script setup lang="ts">
import VgrDescription from "./VgrDescription.vue";

const props = defineProps<{
  label?: string;
  description?: string;
  value?: any;
}>();

const model = defineModel();
</script>

<template>
  <label class="flex items-start gap-2 mr-auto" data-checkbox>
    <input type="checkbox" class="size-4 m-1 accent-healthcare-50" v-model="model">
    <span class="flex flex-col gap-0">
      <span class="text-base leading-6">
        {{ label }}
      </span>
      <vgr-description v-if="description">
        {{ description }}
      </vgr-description>
    </span>
  </label>
</template>