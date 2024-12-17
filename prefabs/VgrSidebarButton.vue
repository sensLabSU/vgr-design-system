<script setup lang="ts">
import {chevronRight} from "../icons";
import {VgrButton, VgrIcon} from "../core";

defineProps<{
  is: string | object;
  to: string;
  active?: boolean;
  icon: string | object;
}>();
</script>

<template>
  <vgr-button :is="is" :to="to"
              :variant="active ? 'filled' : 'ghost'"
              expand="full" size="large" align="start" class="group"
  >
    <vgr-icon :icon="icon" class="size-5 mr-1 -ml-1.5"/>
    <span class="line-clamp-1">
      <slot/>
    </span>
    <vgr-icon :icon="chevronRight" class="size-5 ml-auto transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-2 [.bg-healthcare>&]:opacity-100 [.bg-healthcare>&]:translate-x-2"/>
  </vgr-button>
</template>