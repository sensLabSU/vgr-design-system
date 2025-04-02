<script setup lang="ts">
import type {Ref} from "vue";
import {onBeforeUnmount, onMounted, ref, provide} from "vue";

provide('closeMenu', () => {
  popover.value.hidePopover();
});

const trigger: Ref<HTMLElement> = ref(null as unknown as HTMLElement);
const popover: Ref<HTMLElement> = ref(null as unknown as HTMLElement);
const fixed: Ref<boolean> = ref(false);
const isOpen: Ref<boolean> = ref(false);

function onClick() {
  if(isOpen.value) return;

  toggle();
}

function toggle(): void {
  const op: HTMLElement = trigger.value.offsetParent as HTMLElement;

  fixed.value = ['sticky','fixed'].includes(getComputedStyle(op).position);

  popover.value.togglePopover();

  let offsetLeft = 0;
  let offsetTop = 0;
  let offsetParent: HTMLElement|null = trigger.value.offsetParent as HTMLElement|null;
  if(offsetParent) {
    for(let i = 0; i < 100; i++) {
      offsetLeft += offsetParent!.offsetLeft;
      offsetTop += offsetParent!.offsetTop;
      offsetParent = offsetParent!.offsetParent as HTMLElement|null;
      if(offsetParent === null || offsetParent.tagName === 'BODY') break;
    }
  }

  let left = offsetLeft + trigger.value.offsetLeft;
  if(left > window.innerWidth / 2) {
    left += trigger.value.offsetWidth - popover.value.offsetWidth;
  }

  let top = (fixed.value ? 0 : offsetTop) + (trigger.value.offsetTop + trigger.value.offsetHeight);
  if(top + popover.value.offsetHeight - window.scrollY > window.innerHeight) {
    top = (fixed.value ? 0 : offsetTop) + trigger.value.offsetTop - popover.value.offsetHeight;
  }

  popover.value.style.top = top + 'px';
  popover.value.style.left = left + 'px';
}

function onBeforeToggle(event: Event): void {
  const isClosing = (event as ToggleEvent).newState === 'closed';
  popover.value.classList.toggle('opacity-0', isClosing);
  document.body.classList.toggle('overflow-hidden', !isClosing);
}

function onToggle(event: Event): void {
  isOpen.value = (event as ToggleEvent).newState === 'open';
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
  <div ref="trigger" @click="onClick">
    <slot name="trigger" :is-open="isOpen"/>
  </div>

  <div ref="popover" popover class="p-0 m-0 bg-transparent overflow-visible" style="transition: opacity 0.25s ease, display 0.25s allow-discrete;"
       :class="[fixed ? 'fixed' : 'absolute']"
  >
    <slot/>
  </div>
</template>