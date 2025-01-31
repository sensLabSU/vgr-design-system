<script setup lang="ts">
import {onMounted, ref} from "vue";

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  overflowX?: 'default' | 'hidden' | 'scroll';
  overflowY?: 'default' | 'hidden' | 'scroll';
  lines?: boolean;
  verticalLines?: boolean;
  striped?: boolean;
}>();

const table = ref();
</script>

<template>
  <div class="[[data-card]>&]:rounded-md overflow-hidden" :class="{
    'w-full !overflow-x-auto relative': overflowX === 'scroll',
    'max-h-[70vh] overflow-y-scroll': overflowY === 'scroll',
  }">
    <table ref="table" v-bind="$attrs" class="
      w-full [[data-card]_&]:bg-white [[data-card]_&_*:is(td,th)]:bg-white
      [&_th]:text-left [&_th]:whitespace-nowrap [&_th]:border-b [&_*]:border-neutral-90 [&_th]:font-semibold
      [&_*:is(td,th)]:p-4 [&_*:is(td,th):first-child]:pl-0 [&_*:is(td,th):last-child]:pr-0
      [[data-card]_&_*:is(td,th)]:!p-4 text-sm
    " :class="{
      '[&_td]:border-b': lines,
      '[&_*:is(td,th)+*]:border-l': verticalLines,
      '[&_tr:nth-child(2n-1)>td]:bg-[rgb(0_0_0/0.035)] [[data-card]_&_tr:nth-child(2n-1)>td]:bg-neutral-99 [&_*:is(td,th)]:!p-4': striped,
    }">
      <thead v-if="$slots.header">
        <tr>
          <slot name="header"/>
        </tr>
      </thead>
      <tbody>
        <slot/>
      </tbody>
    </table>
  </div>
</template>