<script setup lang="ts">
import {computed, inject} from "vue";
import VgrDescription from "./VgrDescription.vue";

const props = defineProps<{
  label?: string;
  description?: string;
  value?: any;
}>();

const model = defineModel();
const groupModel = inject('model', null);

const modelProxy = computed({
  get() {
    if(groupModel) {
      return groupModel.value;
    }
    return model.value;
  },
  set(value) {
    if(groupModel) {
      groupModel.value = value;
      return;
    }
    model.value = value;
  }
});
</script>

<template>
  <label class="flex items-start gap-2 mr-auto">
    <input type="radio" class="size-4 m-1 accent-healthcare-50" :value="value" v-model="modelProxy">
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