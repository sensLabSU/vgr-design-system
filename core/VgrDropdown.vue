<script setup lang="ts">
import {onBeforeUnmount, onMounted, Ref, ref} from "vue";
import {provide} from "vue";

provide('closeMenu', () => {
  popover.value.hidePopover();
});

const trigger: Ref<HTMLElement> = ref();
const popover: Ref<HTMLElement> = ref();
const fixed: Ref<boolean> = ref(false);
const isOpen: Ref<boolean> = ref(false);

function toggle(): void {
  const op = trigger.value.offsetParent;

  fixed.value = ['sticky','fixed'].includes(getComputedStyle(op).position);

  popover.value.togglePopover();

  let left = trigger.value.offsetLeft;
  if(trigger.value.offsetLeft > window.innerWidth / 2) {
    left += trigger.value.offsetWidth - popover.value.offsetWidth;
  }

  popover.value.style.top = (trigger.value.offsetTop + trigger.value.offsetHeight) + 'px';
  popover.value.style.left = left + 'px';
}

function onBeforeToggle(event): void {
  popover.value.classList.toggle('opacity-0', event.newState === 'closed');
}

function onToggle(event: ToggleEvent): void {
  isOpen.value = event.newState === 'open';
}

onMounted((): void => {
  popover.value.addEventListener('beforetoggle', onBeforeToggle);
  popover.value.addEventListener('toggle', onToggle);
});

onBeforeUnmount((): void => {
  popover.value.removeEventListener('beforetoggle', onBeforeToggle);
  popover.value.removeEventListener('toggle', onToggle);
});
</script>

<template>
  <div ref="trigger" @click="toggle">
    <slot name="trigger" :is-open="isOpen"/>
  </div>

  <div ref="popover" popover class="p-0 m-0 bg-transparent overflow-visible" style="transition: opacity 0.25s ease, display 0.25s allow-discrete;"
       :class="[fixed ? 'fixed' : 'absolute']"
  >
    <slot/>
  </div>
</template>