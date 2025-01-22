<script setup lang="ts">
import {computed, inject, provide, ref} from "vue";
import Wrap from "../util/wrap.vue";
import {VgrField, VgrLabel, VgrDescription, VgrError} from "./index";

const props = defineProps<{
  type?: string;
  label?: string;
  description?: string;
  'class:input'?: string;
  placeholder?: string;
  error?: string;
}>();

const wrapWithField = computed(() => props.label || props.description);

const generatedId = ref('vgr-component-' + window.crypto.randomUUID());
const componentId = inject('field-id', null) ?? generatedId.value;
provide('component-id', componentId);

const inputEl = ref();
const model = defineModel();

const focus = () => inputEl.value.focus();

defineExpose({
  focus,
});
</script>

<template>
  <Wrap :is="wrapWithField && VgrField">
    <vgr-label v-if="label">{{ label }}</vgr-label>

    <div v-bind="$attrs" class="block w-full relative group/input">
      <input ref="inputEl" :type="type || 'text'" v-model="model" :id="componentId"
             :class="[props['class:input'], {'!border-error': error}]"
             :placeholder="placeholder"
             class="w-full rounded-md block border border-neutral-80 shadow px-2 py-1"
             data-input>
    </div>

    <vgr-description v-if="description">{{ description }}</vgr-description>

    <vgr-error v-if="error">{{ error }}</vgr-error>
  </Wrap>
</template>