<script setup lang="ts">
import {inject} from "vue";
import {VgrIcon} from "./index";

const props = defineProps<{
  icon?: string|object;
  href?: string;
  kbd?: string;
}>();

const closeMenu = inject('closeMenu', () => {});

function onClick() {
  closeMenu();
}
</script>

<template>
  <component :is="href ? 'a' : 'button'" :type="href ? null : 'button'" :href="href || null"
          class="vgr-item py-1.5 px-2 flex items-center whitespace-nowrap w-full rounded-md hover:bg-neutral-95"
          :data-has-icon="!!icon || null"
          @click="onClick"
  >
    <vgr-icon v-if="icon" :icon="icon" class="size-4 mr-3"/>
    <span v-else class="hidden [[data-item-list]:has(>[data-has-icon])_&]:block w-7"></span>
    <slot/>
    <span v-if="kbd" class="text-neutral-70 text-xs ml-auto">{{ kbd }}</span>
  </component>
</template>