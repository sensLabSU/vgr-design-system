<script setup lang="ts">
import type {ComputedRef} from "vue";
import {VgrButton, VgrAvatar, VgrIcon} from "../core";
import {chevronDown} from '../icons';
import {computed} from "vue";

const props = defineProps<{
  name: string;
  ariaLabel?: string;
  'class:avatar'?: string;
  'class:icon'?: string;
}>();

const initials: ComputedRef<string> = computed((): string => {
  return props.name?.replace(/([A-Z])\w+|\W/g, '$1').substring(0, 2) ?? '';
});
</script>

<template>
  <vgr-button variant="ghost" color="white" :aria-label="ariaLabel ?? 'Användarmeny'">
    <vgr-avatar color="purple" :class="[props['class:avatar']]" class="-ml-1 mr-1">{{ initials }}</vgr-avatar>
    {{ name }}
    <vgr-icon :icon="chevronDown" :class="[props['class:icon']]" class="size-5"/>
  </vgr-button>
</template>