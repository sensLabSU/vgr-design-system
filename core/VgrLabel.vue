<script setup lang="ts">
import type {Ref} from "vue";
import {getCurrentInstance, inject, onMounted, ref} from "vue";

const id: Ref<string|null> = ref(null);

const instance = getCurrentInstance();
onMounted(() => {
  if(!(instance!.parent as any).ctx.$el.querySelector('input:not([type="checkbox"]):not([type="radio"]):not([type="image"]):not([type="button"]),textarea')) return;

  id.value = inject('component-id', null) ?? inject('field-id', null);
});
</script>

<template>
  <label class="block text-sm font-medium" :for="id ?? undefined" data-label>
    <slot/>
  </label>
</template>