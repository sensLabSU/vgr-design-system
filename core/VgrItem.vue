<script setup lang="ts">
import {computed, inject} from "vue";
import {VgrIcon, VgrBadge} from "./index";

const props = defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  is?: string|object;
  href?: string;
  to?: string;
  icon?: string|object;
  'icon:class'?: string;
  kbd?: string;
  'kbd:class'?: string;
  badge?: string;
  'badge:class'?: string;
  'badge:variant'?: null | 'default' | 'solid';
  'badge:color'?: null | string;
  dontCloseOnClick?: boolean;
}>();

const color = computed(() => {
  switch(props.variant) {
    case 'primary': return 'dark:text-white bg-healthcare hover:text-healthcare [&.highlight]:text-healthcare dark:bg-healthcare-70 hover:dark:text-healthcare-70 [&.highlight]:dark:text-healthcare-70';
    case 'success': return 'dark:text-white bg-green hover:text-green [&.highlight]:text-green dark:bg-green-70 hover:dark:text-green-70 [&.highlight]:dark:text-green-70';
    case 'warning': return 'dark:text-white bg-yellow hover:text-yellow-60 [&.highlight]:text-yellow-60 dark:bg-yellow-70 hover:dark:text-yellow-70 [&.highlight]:dark:text-yellow-70';
    case 'danger': return 'dark:text-white bg-error hover:text-error-50 [&.highlight]:text-error-50 dark:bg-error-70 hover:dark:text-error-70 [&.highlight]:dark:text-error-70';
    default: return 'text-black bg-black dark:text-white dark:bg-white';
  }
})

const closeMenu = inject('closeMenu', () => {});

function onClick() {
  if(props.dontCloseOnClick) return;
  closeMenu();
}
</script>

<template>
  <component :is="is ?? (href ? 'a' : 'button')"
             :type="(!is || href) ? null : 'button'"
             :to="to ?? null"
             :href="to ?? href ?? null"
             class="vgr-item bg-opacity-0 dark:bg-opacity-0 py-1.5 px-2 flex items-center whitespace-nowrap w-full rounded-md group select-none hover:bg-opacity-5 [&.highlight]:bg-opacity-5 hover:dark:bg-opacity-5 [&.highlight]:dark:bg-opacity-5"
             :class="[color]"
             :data-has-icon="!!icon || null"
             @click="onClick"
             data-item
  >
    <vgr-icon v-if="icon" :icon="icon" :class="[props['icon:class']]" class="size-4 mr-3 opacity-50 group-hover:opacity-100 [.highlight>&]:opacity-100"/>
    <span v-else class="hidden [[data-command-palette]_&]:block [[data-item-list]:has([data-has-icon])_&]:block w-7"></span>
    <slot/>
    <vgr-badge v-if="badge" :class="[props['badge:class']]" :variant="props['badge:variant'] ?? 'default'" class="ml-auto" :color="props['badge:color'] ?? 'base'">{{ badge }}</vgr-badge>
    <span v-if="kbd" :class="[props['kbd:class']]" class="text-neutral-70 font-mono text-xs ml-auto pl-4 rounded [[data-command-palette]_&]:p-1 [[data-command-palette]_&]:bg-black/5">{{ kbd }}</span>
  </component>
</template>