<script setup lang="ts">
import {computed} from "vue";
import {resolveColor} from "../util";
import VgrIcon from "./VgrIcon.vue";

const props = defineProps<{
  variant?: null | 'default' | 'solid';
  size?: null | 'default' | 'small' | 'large';
  color?: null | string;
  pill?: boolean;
  icon?: string | object;
}>();

const colors = {
  healthcare: {
    default: 'bg-healthcare-90 text-healthcare-40',
    solid: 'bg-healthcare-50 text-white',
  },
  culture: {
    default: 'bg-culture-90 text-culture-40',
    solid: 'bg-culture-50 text-white',
  },
  education: {
    default: 'bg-education-90 text-education-40',
    solid: 'bg-education-50 text-white',
  },
  base: {
    default: 'bg-base-90 text-base-40',
    solid: 'bg-base-50 text-white',
  },
  neutral: {
    default: 'bg-neutral-90 text-neutral-40',
    solid: 'bg-neutral-50 text-white',
  },
  error: {
    default: 'bg-error-90 text-error-40',
    solid: 'bg-error-50 text-white',
  },
  purple: {
    default: 'bg-purple-90 text-purple-40',
    solid: 'bg-purple-50 text-white',
  },
  brown: {
    default: 'bg-brown-90 text-brown-40',
    solid: 'bg-brown-50 text-white',
  },
  cyan: {
    default: 'bg-cyan-90 text-cyan-40',
    solid: 'bg-cyan-60 text-white',
  },
  green: {
    default: 'bg-green-90 text-green-40',
    solid: 'bg-green-60 text-white',
  },
  lime: {
    default: 'bg-lime-90 text-lime-40',
    solid: 'bg-lime-60 text-white',
  },
  orange: {
    default: 'bg-orange-90 text-orange-40',
    solid: 'bg-orange-60 text-white',
  },
  pink: {
    default: 'bg-pink-90 text-pink-40',
    solid: 'bg-pink-50 text-white',
  },
  yellow: {
    default: 'bg-yellow-90 text-yellow-40',
    solid: 'bg-yellow-60 text-white',
  },
  blue: {
    default: 'bg-blue-90 text-blue-40',
    solid: 'bg-blue-60 text-white',
  },
  black: {
    default: 'bg-black text-white',
    solid: 'bg-black text-white',
  },
  white: {
    default: 'bg-white text-black',
    solid: 'bg-white text-black',
  },
}

const classes = computed(() => {
  const cls = ['flex items-center gap-1.5 cursor-default'];

  cls.push(props.pill ? 'rounded-full' : 'rounded-md');

  switch (props.size) {
    case 'small': cls.push('py-1 text-xs [&>[data-icon]]:size-3 ' + (props.pill ? 'px-2.5' : 'px-2')); break;
    default: cls.push('py-1 text-sm [&>[data-icon]]:size-4 ' + (props.pill ? 'px-3' : 'px-2')); break;
    case 'large': cls.push('py-1.5 text-sm [&>[data-icon]]:size-4 ' + (props.pill ? 'px-3' : 'px-2')); break;
  }

  const colorName = resolveColor(props.color);
  const color = (typeof(colorName) === 'string') ? colors[colorName] : colors.healthcare;

  switch(props.variant) {
    case 'solid':
      cls.push(color.solid);
      break;
    default:
      cls.push(color.default);
      break;
  }

  return cls.join(' ');
});
</script>

<template>
  <span :class="[classes]">
    <vgr-icon v-if="icon" :icon="icon" class="shrink-0 -ml-0.5"/>
    <slot/>
    <span v-if="$slots.end" class="-mr-0.5">
      <slot name="end"/>
    </span>
  </span>
</template>