<script setup lang="ts">
import {inject} from "vue";

const props = defineProps<{
  name: string;
}>();

const activeTab = inject('group-model', null);
</script>

<template>
  <div class="[&[data-active]:not([data-active=true])]:!hidden" :data-active="activeTab === name" data-tab-panel>
    <slot/>
  </div>
</template>