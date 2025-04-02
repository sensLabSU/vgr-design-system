<script setup lang="ts">
import type {ModelRef, Ref} from "vue";
import {computed, inject, provide, ref} from "vue";
import Wrap from "../util/wrap.vue";
import {VgrField, VgrLabel, VgrDescription, VgrError} from "./index";

const props = defineProps<{
  label?: string;
  description?: string;
  'class:input'?: string;
  placeholder?: string;
  error?: string;
  max?: string | number;
  rows?: number;
}>();

const wrapWithField = computed(() => props.label || props.description);

const generatedId = ref('vgr-component-' + window.crypto.randomUUID());
const componentId = inject('field-id', null) ?? generatedId.value;
provide('component-id', componentId);

const textareaEl: Ref<HTMLTextAreaElement> = ref(undefined as unknown as HTMLTextAreaElement);
const model: ModelRef<any> = defineModel();

const focus = () => textareaEl.value.focus();

defineExpose({
  focus,
});
</script>

<template>
  <Wrap :is="wrapWithField && VgrField">
    <vgr-label v-if="label">{{ label }}</vgr-label>

    <div v-bind="$attrs" class="block w-full relative group/input">
      <textarea ref="textareaEl" :rows="rows ?? 4" v-model="model" :id="componentId"
             :class="[props['class:input'], {'!border-error': error}]"
             :placeholder="placeholder"
             class="w-full rounded-md block border border-neutral-80 shadow px-2 py-1"
             data-textarea
             :maxlength="max !== undefined ? `${max}` : undefined"
      ></textarea>

      <div v-if="max !== undefined" class="mt-1 text-right text-xs text-neutral-60">
        <div class="h-0.5 w-0 rounded-full bg-healthcare-60" :style="{width: (model?.length / +max) * 100 + '%'}"></div>
        {{ model?.length || 0 }} / {{ max }}
      </div>
    </div>

    <vgr-description v-if="description">{{ description }}</vgr-description>

    <vgr-error v-if="error">{{ error }}</vgr-error>
  </Wrap>
</template>