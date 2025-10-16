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
  'icon:class'?: string;
  is?: null | 'span' | 'button';
}>();

const colors = {
  healthcare: {
    default: 'bg-healthcare-90 text-healthcare-40 dark:bg-healthcare-30 dark:text-healthcare-90',
    solid: 'bg-healthcare-50 text-white',
  },
  culture: {
    default: 'bg-culture-90 text-culture-40 dark:bg-culture-30 dark:text-culture-90',
    solid: 'bg-culture-50 text-white',
  },
  education: {
    default: 'bg-education-90 text-education-40 dark:bg-education-30 dark:text-education-90',
    solid: 'bg-education-50 text-white',
  },
  base: {
    default: 'bg-base-90 text-base-40 dark:bg-base-30 dark:text-base-90',
    solid: 'bg-base-50 text-white',
  },
  neutral: {
    default: 'bg-neutral-90 text-neutral-40 dark:bg-neutral-30 dark:text-neutral-90',
    solid: 'bg-neutral-50 text-white',
  },
  error: {
    default: 'bg-error-90 text-error-40 dark:bg-error-30 dark:text-error-90',
    solid: 'bg-error-50 text-white',
  },
  purple: {
    default: 'bg-purple-90 text-purple-40 dark:bg-purple-30 dark:text-purple-90',
    solid: 'bg-purple-50 text-white',
  },
  brown: {
    default: 'bg-brown-90 text-brown-40 dark:bg-brown-30 dark:text-brown-90',
    solid: 'bg-brown-50 text-white',
  },
  cyan: {
    default: 'bg-cyan-90 text-cyan-40 dark:bg-cyan-30 dark:text-cyan-90',
    solid: 'bg-cyan-60 text-white',
  },
  green: {
    default: 'bg-green-90 text-green-40 dark:bg-green-30 dark:text-green-90',
    solid: 'bg-green-60 text-white',
  },
  lime: {
    default: 'bg-lime-90 text-lime-40 dark:bg-lime-30 dark:text-lime-90',
    solid: 'bg-lime-60 text-white',
  },
  orange: {
    default: 'bg-orange-90 text-orange-40 dark:bg-orange-30 dark:text-orange-90',
    solid: 'bg-orange-60 text-white',
  },
  pink: {
    default: 'bg-pink-90 text-pink-40 dark:bg-pink-30 dark:text-pink-90',
    solid: 'bg-pink-50 text-white',
  },
  yellow: {
    default: 'bg-yellow-90 text-yellow-40 dark:bg-yellow-30 dark:text-yellow-90',
    solid: 'bg-yellow-60 text-white',
  },
  blue: {
    default: 'bg-blue-90 text-blue-40 dark:bg-blue-30 dark:text-blue-90',
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

  const colorName = resolveColor(props.color || null);
  const color = (typeof(colorName) === 'string') ? colors[colorName] : colors.base;

  switch(props.variant) {
    case 'solid':
      cls.push(color.solid);
      break;
    default:
      cls.push(color.default);
      break;
  }

  if(props.is === 'button') {
    cls.push('cursor-pointer hover:ring-1 hover:ring-current active:opacity-80');
  }

  return cls.join(' ');
});
</script>

<template>
  <component :is="is || 'span'" :type="is === 'button' ? 'button' : null" :class="[classes]" data-badge>
    <vgr-icon v-if="icon" :icon="icon" class="shrink-0 -ml-0.5" :class="[props['icon:class']]"/>
    <slot/>
    <span v-if="$slots.end" class="-mr-0.5">
      <slot name="end"/>
    </span>
  </component>
</template>