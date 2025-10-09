<script setup lang="ts">
import {computed} from "vue";
import {resolveColor} from "../util";

const props = defineProps<{
  size?: null | 'default' | 'small' | 'large' | 'x-small' | 'x-large';
  color?: string | null;
  variant?: null | 'default' | 'rounded' | 'square';
}>();

const colors = {
  healthcare: 'bg-healthcare-80 text-healthcare-30',
  culture: 'bg-culture-80 text-culture-30',
  education: 'bg-education-80 text-education-30',
  base: 'bg-base-80 text-base-30',
  neutral: 'bg-neutral-80 text-neutral-30',
  error: 'bg-error-80 text-error-30',
  purple: 'bg-purple-80 text-purple-30',
  brown: 'bg-brown-80 text-brown-30',
  cyan: 'bg-cyan-80 text-cyan-30',
  green: 'bg-green-80 text-green-30',
  lime: 'bg-lime-80 text-lime-30',
  orange: 'bg-orange-80 text-orange-30',
  pink: 'bg-pink-80 text-pink-30',
  yellow: 'bg-yellow-80 text-yellow-30',
  white: 'bg-white text-black',
  black: 'bg-black text-white',
};

const classes = computed(() => {
  const resolved = resolveColor(props.color || null, 'education');

  const cls = [typeof resolved === 'string' ? (colors as any)[resolved] : resolved.bg];

  switch(props.size) {
    case 'x-large': cls.push('size-16 text-3xl'); break;
    case 'large': cls.push('size-12 text-2xl'); break;
    case 'small': cls.push('size-6 text-xs'); break;
    case 'x-small': cls.push('size-5 text-2xs'); break;
    default: cls.push('size-8 text-base'); break;
  }

  switch(props.variant) {
    case 'rounded': cls.push('rounded-[20%]'); break;
    case 'square': cls.push('rounded-[5%]'); break;
    default: cls.push('rounded-full'); break;
  }

  return cls.join(' ');
})
</script>

<template>
  <div class="inline-block overflow-hidden align-middle shadow flex items-center justify-center"
    :class="classes" data-avatar
  >
    <slot/>
  </div>
</template>