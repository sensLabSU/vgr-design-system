<script setup lang="ts">
import {VgrCard} from "./index";
</script>

<template>
  <vgr-card class="min-w-48 shadow-md p-1" data-menu data-item-list>
    <slot/>
  </vgr-card>
</template>