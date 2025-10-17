<script setup lang="ts">
import type {ComputedRef} from 'vue';
import type {Align} from "../types";
import {computed} from "vue";
import {resolveColor} from "../util";
import VgrIcon from "./VgrIcon.vue";

type ButtonVariant = 'default' | 'filled' | 'outline' | 'ghost' | 'clear';
type ButtonExpand = 'default' | 'block' | 'full';

const props = withDefaults(defineProps<{
  is?: string | object;
  type?: string;
  href?: string;
  size?: null | 'default' | 'small' | 'large';
  variant?: null | ButtonVariant;
  color?: null | string;
  disabled?: boolean;
  square?: boolean;
  expand?: null | ButtonExpand;
  align?: null | Align;
  tabindex?: number;
  icon?: string | object;
  'icon:class'?: string;
}>(), {
  is: 'button',
  type: 'button',
  size: null,
  variant: null,
  disabled: false,
  tabindex: 0,
});

const colors = {
  healthcare: {
    filled: 'bg-healthcare-40 text-white border-healthcare-40 hover:bg-healthcare-50 hover:border-healthcare-50 active:bg-healthcare-30 active:border-healthcare-30',
    ghost: 'text-healthcare-40 border-transparent hover:bg-healthcare-40/10 focus-visible:bg-healthcare-40/10 active:bg-healthcare-40/30 dark:text-healthcare-60 dark:hover:bg-healthcare-50/20',
    outline: 'text-healthcare-40 border-healthcare-40 hover:bg-healthcare-40/10 focus-visible:bg-healthcare-40/10 active:bg-healthcare-40/30 dark:border-healthcare-60 dark:text-healthcare-60 dark:hover:bg-healthcare-60/10',
  },
  culture: {
    filled: 'bg-culture-40 text-white border-culture-40 hover:bg-culture-50 hover:border-culture-50 active:bg-culture-30 active:border-culture-30',
    ghost: 'text-culture-40 border-transparent hover:bg-culture-40/10 focus-visible:bg-culture-40/10 active:bg-culture/30 dark:text-culture-60 dark:hover:bg-culture-50/20',
    outline: 'text-culture-40 border-culture-40 hover:bg-culture-40/10 focus-visible:bg-culture-40/10 active:bg-culture/30 dark:border-culture-60 dark:text-culture-60 dark:hover:bg-culture-60/10',
  },
  education: {
    filled: 'bg-education-40 text-white border-education-40 hover:bg-education-50 hover:border-education-50 active:bg-education-30 active:border-education-30',
    ghost: 'text-education-40 border-transparent hover:bg-education-40/10 focus-visible:bg-education-40/10 active:bg-education/30 dark:text-education-60 dark:hover:bg-education-50/20',
    outline: 'text-education-40 border-education-40 hover:bg-education-40/10 focus-visible:bg-education-40/10 active:bg-education/30 dark:border-education-60 dark:text-education-60 dark:hover:bg-education-60/10',
  },
  base: {
    filled: 'bg-base-30 text-white border-base-30 hover:bg-base-40 hover:border-base-40 active:bg-base-20 active:border-base-20',
    ghost: 'text-base-30 border-transparent hover:bg-base-30/10 focus-visible:bg-base-30/10 active:bg-base/30 dark:text-base-60 dark:hover:bg-base-50/20',
    outline: 'text-base-30 border-base-30 hover:bg-base-30/10 focus-visible:bg-base-30/10 active:bg-base/30 dark:border-base-60 dark:text-base-60 dark:hover:bg-base-60/10',
  },
  neutral: {
    filled: 'bg-neutral-40 text-white border-neutral-40 hover:bg-neutral-50 hover:border-neutral-50 active:bg-neutral-30 active:border-neutral-30',
    ghost: 'text-neutral-40 border-transparent hover:bg-neutral-40/10 focus-visible:bg-neutral-40/10 active:bg-neutral-40/30 dark:text-neutral-60 dark:hover:bg-neutral-50/20',
    outline: 'text-neutral-40 border-neutral-40 hover:bg-neutral-40/10 focus-visible:bg-neutral-40/10 active:bg-neutral-40/30 dark:border-neutral-60 dark:text-neutral-60 dark:hover:bg-neutral-60/10',
  },
  error: {
    filled: 'bg-error-40 text-white border-error-40 hover:bg-error-50 hover:border-error-50 active:bg-error-30 active:border-error-30',
    ghost: 'text-error-40 border-transparent hover:bg-error-40/10 focus-visible:bg-error-40/10 active:bg-error-40/30 dark:text-error-60 dark:hover:bg-error-50/20',
    outline: 'text-error-40 border-error-40 hover:bg-error-40/10 focus-visible:bg-error-40/10 active:bg-error-40/30 dark:border-error-60 dark:text-error-60 dark:hover:bg-error-60/10',
  },
  purple: {
    filled: 'bg-purple-50 text-white border-purple-50 hover:bg-purple-60 hover:border-purple-60 active:bg-purple-40 active:border-purple-40',
    ghost: 'text-purple-50 border-transparent hover:bg-purple-50/10 focus-visible:bg-purple-50/10 active:bg-purple-50/30 dark:text-purple-60 dark:hover:bg-purple-50/20',
    outline: 'text-purple-50 border-purple-50 hover:bg-purple-50/10 focus-visible:bg-purple-50/10 active:bg-purple-50/30 dark:border-purple-60 dark:text-purple-60 dark:hover:bg-purple-60/10',
  },
  brown: {
    filled: 'bg-brown-50 text-white border-brown-50 hover:bg-brown-60 hover:border-brown-60 active:bg-brown-40 active:border-brown-40',
    ghost: 'text-brown-50 border-transparent hover:bg-brown-50/10 focus-visible:bg-brown-50/10 active:bg-brown-50/30 dark:text-brown-60 dark:hover:bg-brown-50/20',
    outline: 'text-brown-50 border-brown-50 hover:bg-brown-50/10 focus-visible:bg-brown-50/10 active:bg-brown-50/30 dark:border-brown-60 dark:text-brown-60 dark:hover:bg-brown-60/10',
  },
  cyan: {
    filled: 'bg-cyan-50 text-white border-cyan-50 hover:bg-cyan-60 hover:border-cyan-60 active:bg-cyan-40 active:border-cyan-40',
    ghost: 'text-cyan-50 border-transparent hover:bg-cyan-50/10 focus-visible:bg-cyan-50/10 active:bg-cyan-50/30 dark:text-cyan-60 dark:hover:bg-cyan-50/20',
    outline: 'text-cyan-50 border-cyan-50 hover:bg-cyan-50/10 focus-visible:bg-cyan-50/10 active:bg-cyan-50/30 dark:border-cyan-60 dark:text-cyan-60 dark:hover:bg-cyan-60/10',
  },
  green: {
    filled: 'bg-green-50 text-white border-green-50 hover:bg-green-60 hover:border-green-60 active:bg-green-40 active:border-green-40',
    ghost: 'text-green-50 border-transparent hover:bg-green-50/10 focus-visible:bg-green-50/10 active:bg-green-50/30 dark:text-green-60 dark:hover:bg-green-50/20',
    outline: 'text-green-50 border-green-50 hover:bg-green-50/10 focus-visible:bg-green-50/10 active:bg-green-50/30 dark:border-green-60 dark:text-green-60 dark:hover:bg-green-60/10',
  },
  lime: {
    filled: 'bg-lime-50 text-white border-lime-50 hover:bg-lime-60 hover:border-lime-60 active:bg-lime-40 active:border-lime-40',
    ghost: 'text-lime-50 border-transparent hover:bg-lime-50/10 focus-visible:bg-lime-50/10 active:bg-lime-50/30 dark:text-lime-60 dark:hover:bg-lime-50/20',
    outline: 'text-lime-50 border-lime-50 hover:bg-lime-50/10 focus-visible:bg-lime-50/10 active:bg-lime-50/30 dark:border-lime-60 dark:text-lime-60 dark:hover:bg-lime-60/10',
  },
  orange: {
    filled: 'bg-orange-50 text-white border-orange-50 hover:bg-orange-60 hover:border-orange-60 active:bg-orange-40 active:border-orange-40',
    ghost: 'text-orange-50 border-transparent hover:bg-orange-50/10 focus-visible:bg-orange-50/10 active:bg-orange-50/30 dark:text-orange-60 dark:hover:bg-orange-50/20',
    outline: 'text-orange-50 border-orange-50 hover:bg-orange-50/10 focus-visible:bg-orange-50/10 active:bg-orange-50/30 dark:border-orange-60 dark:text-orange-60 dark:hover:bg-orange-60/10',
  },
  pink: {
    filled: 'bg-pink-50 text-white border-pink-50 hover:bg-pink-60 hover:border-pink-60 active:bg-pink-40 active:border-pink-40',
    ghost: 'text-pink-50 border-transparent hover:bg-pink-50/10 focus-visible:bg-pink-50/10 active:bg-pink-50/30 dark:text-pink-60 dark:hover:bg-pink-50/20',
    outline: 'text-pink-50 border-pink-50 hover:bg-pink-50/10 focus-visible:bg-pink-50/10 active:bg-pink-50/30 dark:border-pink-60 dark:text-pink-60 dark:hover:bg-pink-60/10',
  },
  yellow: {
    filled: 'bg-yellow-50 text-white border-yellow-50 hover:bg-yellow-60 hover:border-yellow-60 active:bg-yellow-40 active:border-yellow-40',
    ghost: 'text-yellow-50 border-transparent hover:bg-yellow-50/10 focus-visible:bg-yellow-50/10 active:bg-yellow-50/30 dark:text-yellow-60 dark:hover:bg-yellow-50/20',
    outline: 'text-yellow-50 border-yellow-50 hover:bg-yellow-50/10 focus-visible:bg-yellow-50/10 active:bg-yellow-50/30 dark:border-yellow-60 dark:text-yellow-60 dark:hover:bg-yellow-60/10',
  },
  white: {
    filled: 'bg-white text-black border-transparent hover:bg-white/90 active:bg-white/80',
    ghost: 'text-white border-transparent hover:bg-white/10 focus-visible:bg-white/10 active:bg-white/30',
    outline: 'text-white border-white hover:bg-white/10 focus-visible:bg-white/10 active:bg-white/30',
  },
  blue: {
    filled: 'bg-blue-50 text-white border-blue-50 hover:bg-blue-60 hover:border-blue-60 active:bg-blue-40 active:border-blue-40',
    ghost: 'text-blue-50 border-transparent hover:bg-blue-50/10 focus-visible:bg-blue-50/10 active:bg-blue-50/30 dark:text-blue-60 dark:hover:bg-blue-50/20',
    outline: 'text-blue-50 border-blue-50 hover:bg-blue-50/10 focus-visible:bg-blue-50/10 active:bg-blue-50/30 dark:border-blue-60 dark:text-blue-60 dark:hover:bg-blue-60/10',
  },
  black: {
    filled: 'bg-black text-white border-transparent hover:bg-black/50 active:bg-black/80',
    ghost: 'text-black border-transparent hover:bg-black/10 focus-visible:bg-black/10 active:bg-black/30',
    outline: 'text-black border-black hover:bg-black/10 focus-visible:bg-black/10 active:bg-black/30',
  },
}

const classes: ComputedRef<string> = computed((): string => {
  const cls = [];

  if(props.square) {
    switch(props.size) {
      case 'small': cls.push('size-7 text-sm'); break;
      case 'large': cls.push('size-12 text-lg'); break;
      default: cls.push('size-9 text-base'); break;
    }
  } else {
    switch(props.size) {
      case 'small': cls.push('leading-5 py-1 px-3 text-sm'); break;
      case 'large': cls.push('leading-8 py-1.5 px-4 text-lg'); break;
      default: cls.push('leading-6 py-1.5 px-3 text-base'); break;
    }
  }

  const colorName = resolveColor(props.color || null);
  const color = (typeof(colorName) === 'string') ? colors[colorName] : colors.healthcare;

  switch(props.variant) {
    case 'filled':
      cls.push(color.filled);
      break;
    case 'ghost':
    case 'clear':
      cls.push(color.ghost);
      break;
    case 'outline':
    default:
      cls.push(color.outline);
      break;
  }

  switch(props.expand) {
    case 'block':
      cls.push('w-full');
      break;
    case 'full':
      cls.push('w-full');
      cls.push(props.size === 'small' ? 'rounded-md' : 'rounded-lg');
      break;
    default:
      cls.push(props.size === 'small' ? 'rounded-md' : 'rounded-lg');
      break;
  }

  switch(props.align) {
    case 'left':
    case 'start':
      cls.push('justify-start');
      break;
    case 'right':
    case 'end':
      cls.push('justify-end');
      break;
    default:
      cls.push('justify-center');
      break;
  }

  if(props.disabled) {
    cls.push('opacity-50 pointer-events-none cursor-default');
  }

  return cls.join(' ');
});
</script>

<template>
  <component :is="is"
             :type="is === 'button' ? type : null"
             :href="is === 'a' ? href : null"
             role="button"
             class="flex items-center gap-2 transition-colors border-2 focus-visible:outline-offset-4 focus-visible:outline-healthcare select-none"
             :class="[classes]"
             :disabled="disabled"
             :aria-disabled="disabled ? 'true' : null"
             :tabindex="disabled ? -1 : tabindex"
             data-button
  >
    <vgr-icon v-if="icon" :icon="icon" class="size-4" :class="[props['icon:class']]"/>
    <slot/>
  </component>
</template>