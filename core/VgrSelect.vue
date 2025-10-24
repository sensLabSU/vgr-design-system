<script setup lang="ts">
import {computed, inject, provide, ref} from "vue";
import {chevronDown} from "../icons";
import Wrap from "../util/wrap.vue";
import {VgrDescription, VgrError, VgrField, VgrLabel, VgrIcon} from "./index";

const props = defineProps<{
  id?: string;
  type?: string;
  label?: string;
  description?: string;
  'select:class'?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  blur: void;
  focus: void;
  change: [Event];
}>();

const wrapWithField = computed(() => props.label || props.description);

const generatedId = ref('vgr-component-' + window.crypto.randomUUID());
const componentId = props.id ?? inject('field-id', null) ?? generatedId.value;
provide('component-id', componentId);

const inputEl = ref();
const model = defineModel();

const focus = () => inputEl.value.focus();
const blur = () => inputEl.value.blur();

defineExpose({
  focus, blur,
});
</script>

<template>
  <Wrap :is="wrapWithField && VgrField">
    <vgr-label v-if="label" :for="componentId">{{ label }}</vgr-label>

    <div v-bind="$attrs" class="block w-full relative text-[1rem] group text-black dark:text-white leading-6">
      <select ref="selectEl" v-model="model" :id="componentId"
              class="w-full rounded-md block border border-neutral-80 bg-white dark:bg-base-10 dark:border-base-40 shadow pl-2 pr-8 py-1 appearance-none"
              :class="[props['select:class'], {'!border-error': error, 'pointer-events-none opacity-50 cursor-default': disabled}]"
              :disabled="disabled"
              data-select
              @focus="$emit('focus')"
              @blur="$emit('blur')"
              @change="$emit('change', $event as Event)"
      >
        <slot/>
      </select>
      <div v-if="placeholder && !model" class="absolute left-px top-px px-2 py-1 opacity-50 pointer-events-none" :class="{'!opacity-25': disabled}">{{ placeholder }}</div>
      <vgr-icon :icon="chevronDown" class="size-5 absolute right-2 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 pointer-events-none" :class="{'!opacity-25': disabled}"/>
    </div>

    <vgr-description v-if="description">{{ description }}</vgr-description>

    <vgr-error v-if="error">{{ error }}</vgr-error>
  </Wrap>
</template>