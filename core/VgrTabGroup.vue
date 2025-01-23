<script setup lang="ts">
import {provide, ref} from "vue";

const model = ref(null);

function onTabChanged(name) {
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