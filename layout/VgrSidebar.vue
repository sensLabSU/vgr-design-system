<script setup lang="ts">
import {onMounted, onUpdated, Ref, ref} from "vue";

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  sticky?: boolean;
}>();

const bar: Ref = ref();
const top: Ref<number> = ref(0);

onUpdated(() => top.value = bar.value.offsetTop);
onMounted(() => top.value = bar.value.offsetTop);
</script>

<template>
  <nav ref="bar" class="h-auto" data-sidebar>
    <div v-bind="$attrs" class="w-64 h-full bg-white relative" :class="{'sticky !h-[calc(100vh-var(--top,0px))] top-[--top] z-50': sticky}" :style="{'--top': (sticky ? top : 0) +'px'}">
      <!-- Default slot -->
      <slot/>
      <!-- Shadow -->
      <div class="absolute left-full inset-y-0 w-3 bg-gradient-to-r from-black/5 z-0"></div>
    </div>
  </nav>
</template>