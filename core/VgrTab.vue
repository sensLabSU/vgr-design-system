<script setup lang="ts">
import {computed, inject} from "vue";
import VgrBadge from "./VgrBadge.vue";

const props = defineProps<{
  name: string;
  badge?: null | string | number;
  'badge:color'?: string;
  'badge:variant'?: null | 'default' | 'solid';
}>();

const variant: string|null = inject('variant', null);
const activeTab: string|null = inject('active-tab', null);
const activateTab = inject('activate-tab', (name: string) => {});

const classes = computed(() => {
  const cls = [];

  if(variant) {
    switch(variant) {
      case 'bar':
        cls.push('px-4 py-3 min-w-40 bg-white border-y-2 border-transparent text-neutral-60 hover:text-black hover:bg-white/75 flex-1 dark:bg-base-20 dark:text-neutral-80 dark:hover:bg-base-30 hover:text-white');
        cls.push('[&[data-active=true]]:border-b-healthcare-60 [&[data-active=true]]:text-healthcare dark:[&[data-active=true]]:border-b-white dark:[&[data-active=true]]:text-white');
        break;
      case 'pills':
        cls.push('bg-neutral-90 dark:bg-neutral-20 dark:text-neutral-80 px-3.5 py-1.5 rounded-full hover:bg-neutral-80 dark:hover:bg-neutral-30 text-neutral-40 hover:text-black hover:text-white');
        cls.push('[&[data-active=true]]:bg-healthcare [&[data-active=true]]:text-white dark:[&[data-active=true]]:bg-white dark:[&[data-active=true]]:text-black');
        cls.push('[&_[data-badge]]:-mr-1');
        break;
      case 'segmented':
        cls.push('rounded-md px-2 py-1.5 flex-1 min-w-32 text-neutral-40 hover:text-black dark:text-neutral-70 dark:hover:text-white');
        cls.push('[&[data-active=true]]:bg-white [&[data-active=true]]:text-black [&[data-active=true]]:shadow-sm');
        break;
      default:
        cls.push('px-2 py-4 -mb-px text-neutral-40 border-b-2 border-transparent hover:border-base hover:text-black dark:text-neutral-70 dark:hover:border-transparent dark:hover:text-white');
        cls.push('[&[data-active=true]]:border-healthcare [&[data-active=true]]:text-healthcare dark:[&[data-active=true]]:border-white dark:[&[data-active=true]]:text-white [&[data-active=true]]:border-b-2');
        break;
    }
  }

  return cls.join(' ');
});
</script>

<template>
  <button type="button" role="tab"
          @click="() => activateTab(name)"
          class="flex items-center justify-center gap-3 select-none"
          :class="[classes]"
          data-tab :data-active="activeTab === name">
    <slot/>
    <vgr-badge v-if="badge !== null && badge !== undefined" pill size="small"
               class="!pointer-events-none"
               :color="props['badge:color'] ?? (activeTab === name ? 'healthcare' : 'base')"
               :variant="props['badge:variant'] ?? null"
    >
      {{ badge }}
    </vgr-badge>
  </button>
</template>