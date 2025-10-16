<script setup lang="ts">
import {computed, inject} from "vue";
import VgrDescription from "./VgrDescription.vue";

const props = defineProps<{
  label?: string;
  description?: string;
  value?: any;
  'label:class'?: string;
  'description:class'?: string;
  disabled?: boolean;
}>();

const model = defineModel();
const groupModel: any = inject('model', null);

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
  <label class="flex items-start gap-2 mr-auto select-none" data-radio :class="{'pointer-events-none opacity-65': disabled}">
    <input type="radio" class="size-4 m-1 accent-healthcare-50 dark:accent-healthcare-60" :value="value" v-model="modelProxy" :disabled="disabled">
    <span class="flex flex-col gap-0">
      <span class="leading-6" :class="[props['label:class']]">
        {{ label }}
      </span>
      <vgr-description v-if="description" :class="[props['description:class']]">
        {{ description }}
      </vgr-description>
    </span>
  </label>
</template>