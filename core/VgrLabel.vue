<script setup>
import {inject} from "vue";

const id = inject('id');
</script>

<template>
  <label class="block text-sm font-medium" :for="id" data-label>
    <slot/>
  </label>
</template>