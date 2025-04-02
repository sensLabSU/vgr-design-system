<script setup lang="ts">
import {computed, inject} from "vue";
import {VgrIcon, VgrBadge} from "./index";

const props = defineProps<{
  is?: string|object;
  icon?: string|object;
  href?: string;
  to?: string;
  kbd?: string;
  badge?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  'class:icon'?: string;
  'class:kbd'?: string;
  'class:badge'?: string;
  dontCloseOnClick?: boolean;
}>();

const color = computed(() => {
  switch(props.variant) {
    case 'primary': return 'bg-healthcare hover:text-healthcare [&.highlight]:text-healthcare';
    case 'success': return 'bg-green hover:text-green [&.highlight]:text-green';
    case 'warning': return 'bg-yellow hover:text-yellow-60 [&.highlight]:text-yellow-60';
    case 'danger': return 'bg-error hover:text-error-50 [&.highlight]:text-error-50';
    default: return 'bg-black';
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
             class="vgr-item bg-opacity-0 py-1.5 px-2 flex items-center whitespace-nowrap w-full rounded-md group select-none hover:bg-opacity-5 [&.highlight]:bg-opacity-5"
             :class="[color]"
             :data-has-icon="!!icon || null"
             @click="onClick"
             data-item
  >
    <vgr-icon v-if="icon" :icon="icon" :class="[props['class:icon']]" class="size-4 mr-3 opacity-50 group-hover:opacity-100 [.highlight>&]:opacity-100"/>
    <span v-else class="hidden [[data-command-palette]_&]:block [[data-item-list]:has([data-has-icon])_&]:block w-7"></span>
    <slot/>
    <vgr-badge v-if="badge" :class="[props['class:badge']]" class="ml-auto" color="base">{{ badge }}</vgr-badge>
    <span v-if="kbd" :class="[props['class:kbd']]" class="text-neutral-70 font-mono text-xs ml-auto pl-4 rounded [[data-command-palette]_&]:p-1 [[data-command-palette]_&]:bg-black/5">{{ kbd }}</span>
  </component>
</template>