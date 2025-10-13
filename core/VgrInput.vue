<script setup lang="ts">
import {computed, inject, provide, ref} from "vue";
import Wrap from "../util/wrap.vue";
import {VgrField, VgrLabel, VgrDescription, VgrError} from "./index";

const props = defineProps<{
  id?: string;
  type?: string;
  label?: string;
  description?: string;
  'class:input'?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  blur: void;
  focus: void;
  input: [InputEvent];
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
const select = () => inputEl.value.select();

defineExpose({
  focus, blur, select,
});
</script>

<template>
  <Wrap :is="wrapWithField && VgrField">
    <vgr-label v-if="label">{{ label }}</vgr-label>

    <div v-bind="$attrs" class="block w-full relative group/input">
      <input ref="inputEl" :type="type || 'text'" v-model="model" :id="componentId"
             :class="[props['class:input'], {'!border-error': error, 'pointer-events-none opacity-50 cursor-default': disabled}]"
             :placeholder="placeholder"
             :disabled="disabled"
             class="w-full rounded-md block border border-neutral-80 bg-white shadow px-2 py-1"
             data-input
             @focus="$emit('focus')"
             @blur="$emit('blur')"
             @input="$emit('input', $event as InputEvent)"
             @change="$emit('change', $event as Event)"
      >
    </div>

    <vgr-description v-if="description">{{ description }}</vgr-description>

    <vgr-error v-if="error">{{ error }}</vgr-error>
  </Wrap>
</template>