<script setup lang="ts">
import {provide} from "vue";
import VgrField from "./VgrField.vue";
import {VgrLabel} from "./index";

const props = defineProps<{
  label?: string;
  'wrapper:class'?: string;
}>();

const model = defineModel();

provide('model', model);
</script>

<template>
  <vgr-field>
    <vgr-label v-if="label">{{ label }}</vgr-label>

    <div class="flex flex-col gap-2" :class="[props['wrapper:class']]">
      <slot/>
    </div>
  </vgr-field>
</template>