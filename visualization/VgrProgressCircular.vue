<script setup lang="ts">

const props = withDefaults(defineProps<{
  fill: number;
  thickness?: number;
  stroke?: boolean;
  colorClass?: string;
  start?: number,
  arc?: number,
}>(), {
  thickness: 0.12,
  colorClass: 'fill-green',
  start: Math.PI / 2,
  arc: 0.75
});

function circleFill(percent: number, thickness = 0.1, padding = 0) {
  const sa = props.start + Math.PI * props.arc;
  const ea = sa - (Math.PI * 2 * props.arc) * percent;
  const or = 1 - padding * 2;
  const ir = or - thickness;
  const ht = thickness / 2;

  let result = 'M' + Math.cos(sa) * or + ',' + -Math.sin(sa) * or;

  if (percent > 0.5) {
    result += ' A ' + or + ' ' + or + ' 0 0 1 0 ' + -Math.sin(Math.PI / 2) * or;
  }
  result += ' A ' + or + ' ' + or + ' 0 0 1 ' + Math.cos(ea) * or + ' ' + -Math.sin(ea) * or;

  result += ' A ' + ht + ' ' + ht + ' 0 0 1 ' + Math.cos(ea) * ir + ',' + -Math.sin(ea) * ir;

  if (percent > 0.5) {
    result += ' A ' + ir + ' ' + ir + ' 0 0 0 0 ' + -Math.sin(Math.PI / 2) * ir;
  }
  result += ' A ' + ir + ' ' + ir + ' 0 0 0 ' + Math.cos(sa) * ir + ' ' + -Math.sin(sa) * ir;

  result += ' A ' + ht + ' ' + ht + ' 0 0 1 ' + Math.cos(sa) * or + ',' + -Math.sin(sa) * or;

  return result;
}
</script>

<template>
  <div class="flex items-center justify-center relative">
    <svg viewBox="-1 -1 2 2" class="size-full">
      <path :d="circleFill(1, thickness, 0.01)" class="fill-neutral-80" :class="{'stroke-[0.03] stroke-neutral-80': stroke}"/>
      <path :d="circleFill(fill, thickness, 0.01)" :class="colorClass"/>
    </svg>
    <div v-if="$slots.default"
         class="absolute left-1/2 top-1/2 text-center -translate-x-1/2 -translate-y-1/2"
         :style="{width: (1 - thickness) * 90 + '%'}"
    >
      <slot/>
    </div>
  </div>
</template>
