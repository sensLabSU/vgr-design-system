<script setup lang="ts">
import {inject, onMounted, type Ref, ref} from "vue";
import {chevronDown, chevronRight, chevronUp} from "../icons";
import {VgrIcon} from "./index";

const props = defineProps<{
  heading: string;
  disabled?: boolean;
  expanded?: boolean;
  'icon:class'?: string;
  'header:class'?: string;
  'content:class'?: string;
}>();

const emit = defineEmits<{
  opened: [];
  closed: [];
  toggle: [];
}>();

const details: Ref<HTMLDetailsElement> = ref(null as unknown as HTMLDetailsElement);
const isOpen = ref(false);
const name = inject('name', null);

onMounted(() => {
  props.expanded && open();
})

function onToggle(e: ToggleEvent) {
  isOpen.value = (e.target as HTMLDetailsElement).open;

  isOpen.value ? emit( 'opened') : emit( 'closed');
  emit('toggle');
}

function open() {
  details.value.open = true;
}

function close() {
  details.value.open = false;
}

function toggle() {
  details.value.open = !details.value.open;
}

defineExpose({
  open, close, toggle
});
</script>

<template>
  <details ref="details"
      class="py-4 first:pt-0 last:pb-0 [[data-accordion-item]+&]:border-t border-base-90 dark:border-base-40 select-none
        [&[disabled]]:opacity-50 [&[disabled]]:pointer-events-none
      "
      data-accordion-item
      @toggle="onToggle"
      :name="name ?? undefined"
      :disabled="disabled ? true : null"
  >
    <summary class="flex items-center justify-between gap-8 group cursor-pointer text-sm font-medium [[data-reversed]_&]:justify-start [[data-reversed]_&]:gap-2" :class="props['header:class']">
      <vgr-icon :icon="isOpen ? chevronDown : chevronRight" class="size-5 opacity-25 group-hover:opacity-75 hidden [[data-reversed]_&]:block" :class="[{'opacity-75': isOpen}, props['icon:class']]"/>
      <span>
        {{ heading }}
      </span>
      <vgr-icon :icon="isOpen ? chevronUp : chevronDown" class="size-5 opacity-25 group-hover:opacity-75 [[data-reversed]_&]:hidden" :class="[{'opacity-75': isOpen}, props['icon:class']]"/>
    </summary>
    <p class="pt-2 text-base-50 dark:text-base-60" :class="props['content:class']">
      <slot/>
    </p>
  </details>
</template>

<style scoped>
:global([data-transition] details) {
  interpolate-size: allow-keywords;
}
:global([data-transition] details::details-content) {
  transition:
      block-size 0.25s,
      content-visibility 0.25s allow-discrete;
  overflow: hidden;
  block-size: 0;
}
:global([data-transition] details[open]::details-content) {
  block-size: auto;
}
</style>