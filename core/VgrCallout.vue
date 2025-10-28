<script setup lang="ts">
import {computed} from "vue";
import {checkmark, errorOutline, exclamationCircleOutline, infoCircleOutline, warningOutline} from "../icons";
import {VgrCard, VgrIcon} from "./index";

const props = defineProps<{
  heading?: string;
  icon?: null | object | string;
  compact?: boolean;
  variant?: null | 'default' | 'information' | 'success' | 'warning' | 'danger';
  'icon:class'?: string;
  'heading:class'?: string;
  'content:class'?: string;
}>();

const cardClasses = computed(() => {
  switch(props.variant) {
    case 'information': return '!bg-blue-95 text-blue-30 !border-blue-80 dark:!bg-blue-10 dark:text-blue-90 dark:!border-blue-40';
    case 'success': return '!bg-green-95 text-green-30 !border-green-80 dark:!bg-green-20 dark:text-green-90 dark:!border-green-40';
    case 'warning': return '!bg-yellow-99 text-yellow-30 !border-yellow-80 dark:!bg-yellow-20 dark:text-yellow-90 dark:!border-yellow-40';
    case 'danger': return '!bg-error-95 text-error-30 !border-error-80 dark:!bg-error-10 dark:text-error-80 dark:!border-error-40';
   default: return '!bg-base-99 text-black !border-base-80 dark:!bg-base-30 dark:text-white dark:!border-base-50';
  }
});

const textClasses = computed(() => {
  switch(props.variant) {
    case 'information': return 'text-blue-30/60 dark:text-blue-90/75';
    case 'success': return 'text-green-30/60 dark:text-green-90/75';
    case 'warning': return 'text-yellow-30/60 dark:text-yellow-90/75';
    case 'danger': return 'text-error-30/60 dark:text-error-80/75';
   default: return 'text-black/60 dark:text-white/75';
  }
});

const resolvedIcon = computed(() => {
  if(props.icon) return props.icon;

  switch(props.variant) {
    case 'information': return infoCircleOutline;
    case 'success': return checkmark;
    case 'warning': return warningOutline;
    case 'danger': return errorOutline;
    default: return exclamationCircleOutline;
  }
});

const iconSize = computed(() => {
  if(props.icon) return 'size-[1.125rem] -m-px';

  switch(props.variant) {
    case 'information':
    case 'danger':
      return 'size-4';
    default:
      return 'size-[1.125rem] -m-px';
  }
});
</script>

<template>
  <vgr-card class="flex items-start gap-3 text-sm" :class="[cardClasses, compact ? 'p-3' : 'p-4']">
    <vgr-icon v-if="!compact" :icon="resolvedIcon" class="opacity-60 dark:opacity-75" :class="[iconSize, props['icon:class']]"/>

    <div :class="[compact ? 'space-y-2' : 'space-y-3']">
      <div class="leading-4 font-medium flex items-center gap-2">
        <vgr-icon v-if="compact" :icon="resolvedIcon" class="opacity-60 dark:opacity-75" :class="[iconSize, props['icon:class']]"/>
        <span class="w-full flex" :class="props['heading:class']">
          <slot name="heading">{{ heading }}</slot>
        </span>
      </div>

      <div v-if="$slots.default" class="" :class="[compact ? 'space-y-2' : 'space-y-3', textClasses, props['content:class']]">
        <slot/>
      </div>
    </div>
  </vgr-card>
</template>