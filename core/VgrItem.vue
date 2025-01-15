<script setup lang="ts">
import {inject} from "vue";
import {VgrIcon} from "./index";

const props = defineProps<{
  is?: string|object;
  icon?: string|object;
  href?: string;
  to?: string;
  kbd?: string;
}>();

const closeMenu = inject('closeMenu', () => {});

function onClick() {
  closeMenu();
}
</script>

<template>
  <component :is="is ?? (href ? 'a' : 'button')"
             :type="(!is || href) ? null : 'button'"
             :to="to ?? null"
             :href="to ?? href ?? null"
             class="vgr-item py-1.5 px-2 flex items-center whitespace-nowrap w-full rounded-md hover:bg-neutral-95 select-none"
             :data-has-icon="!!icon || null"
             @click="onClick"
  >
    <vgr-icon v-if="icon" :icon="icon" class="size-4 mr-3 [[data-command-palette]_&]:opacity-50"/>
    <span v-else class="hidden [[data-command-palette]_&]:block [[data-item-list]:has(>[data-has-icon])_&]:block w-7"></span>
    <slot/>
    <span v-if="kbd" class="text-neutral-70 font-mono text-xs ml-auto rounded [[data-command-palette]_&]:p-1 [[data-command-palette]_&]:bg-neutral-95">{{ kbd }}</span>
  </component>
</template>