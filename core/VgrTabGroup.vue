<script setup lang="ts">
import type {Ref} from "vue";
import {provide, ref} from "vue";

const model: Ref<string|null> = ref(null);

function onTabChanged(name: string) {
  model.value = name;
}

provide('on-tab-changed', onTabChanged);
provide('group-model', model);
</script>

<template>
  <div class="" data-tab-group>
    <slot/>
  </div>
</template>