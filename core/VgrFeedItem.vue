<script setup lang="ts">
import VgrIcon from "./VgrIcon.vue";
import {circleOutline} from "../icons";

const props = defineProps<{
  type?: 'default' | 'comment';
  dateTime?: string;
}>();
</script>

<template>
  <li class="flex gap-2 items-stretch" data-feed-item>
    <div class="flex flex-col">
      <span class="m-1 shrink-0 flex flex-col items-center justify-center relative z-1" :class="{'mt-3': type == 'comment'}">
        <slot name="icon">
          <span class="rounded-full bg-white dark:bg-base-20 flex flex-col items-center justify-center">
            <vgr-icon :icon="circleOutline" class="size-2 m-1.5 text-neutral-50 dark:text-neutral-70"/>
          </span>
        </slot>
      </span>
      <div class="hidden [[data-feed-item]:last-child_&]:block flex-1 bg-white dark:bg-base-20 -mt-1"></div>
    </div>
    <div class="flex-1 flex items-start *:leading-5" :class="{'px-2.5 py-1.5 rounded-md border border-neutral-90 bg-neutral-95 dark:bg-neutral-30 dark:border-neutral-40': type === 'comment'}">
      <div class="py-1 text-sm">
        <slot/>
      </div>
      <div v-if="dateTime" class="p-1 pl-4 ml-auto text-xs text-black/40 dark:text-white/40 shrink-0">{{ dateTime }}</div>
    </div>
  </li>
</template>