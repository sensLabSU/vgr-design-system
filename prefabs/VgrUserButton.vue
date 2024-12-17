<script setup lang="ts">
import {VgrButton, VgrAvatar, VgrIcon} from "../core";
import {chevronDown} from '../icons';
import {computed, ComputedRef} from "vue";

const props = defineProps<{
  name: string;
  ariaLabel?: string;
}>();

const initials: ComputedRef<string> = computed((): string => {
  return props.name?.replace(/([A-Z])\w+|\W/g, '$1').substring(0, 2) ?? '';
});
</script>

<template>
  <vgr-button variant="ghost" color="white" :aria-label="ariaLabel ?? 'Användarmeny'">
    <vgr-avatar color="purple" class="-ml-1 mr-1">{{ initials }}</vgr-avatar>
    {{ name }}
    <vgr-icon :icon="chevronDown" class="size-5"/>
  </vgr-button>
</template>