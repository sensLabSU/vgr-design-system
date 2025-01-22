<script setup>
import {getCurrentInstance, inject, onMounted, ref} from "vue";

const id = ref(null);

const instance = getCurrentInstance();
onMounted(() => {
  if(!instance.parent.ctx.$el.querySelector('input:not([type="checkbox"]):not([type="radio"]):not([type="image"]):not([type="button"]),textarea')) return;

  id.value = inject('component-id', null) ?? inject('field-id', null);
});
</script>

<template>
  <label class="block text-sm font-medium" :for="id" data-label>
    <slot/>
  </label>
</template>