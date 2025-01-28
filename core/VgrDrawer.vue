<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  open?: any;
  'class:overlay'?: string;
}>();

const emit = defineEmits<{
  opening: [];
  opened: [];
  closing: [];
  closed: [];
  wantsToClose: [];
}>();

const popover = ref();
const wrapper = ref();
const drawer = ref();

function present() {
  emit('opening');
  popover.value.showPopover();

  setTimeout(() => emit('opened'), 250);
}

function dismiss() {
  emit('closing');
  popover.value.hidePopover();

  setTimeout(() => emit('closed'), 250);
}

function close() {
  if(props.open === undefined) {
    dismiss();
    return;
  }

  emit('wantsToClose');
}

function onClickOverlay(e) {
  if(e.target.closest('[role="dialog"]')) return;

  close();
}

function onKeyPress(event: KeyboardEvent) {
  if(event.key === 'Escape') {
    close();
  }
}

function onBeforeToggle(event: Event): void {
  const closing = (event as ToggleEvent).newState === 'closed';

  popover.value.classList.toggle('opacity-0', closing);
  drawer.value.classList.toggle('translate-x-full', closing);

  document.body.classList.toggle('overflow-hidden', !closing);

  if(closing) {
    window.removeEventListener('keydown', onKeyPress);
  } else {
    window.addEventListener('keydown', onKeyPress);
  }
}

onMounted(() => {
  popover.value.addEventListener('beforetoggle', onBeforeToggle);

  if(props.open === true) {
    emit('opening');
    popover.value.showPopover();
    setTimeout(() => emit('opened'), 250);
  }
});

onBeforeUnmount((): void => {
  popover.value.removeEventListener('beforetoggle', onBeforeToggle);
});

watch(() => props.open, v => {
  if(v) {
    emit('opening');
    popover.value.showPopover();
    setTimeout(() => emit('opened'), 250);
  } else {
    emit('closing');
    popover.value.hidePopover();
    setTimeout(() => emit('closed'), 250);
  }
});

defineExpose({
  present, dismiss,
});
</script>

<template>
  <div ref="popover" popover="manual" class="size-full fixed bg-transparent starting:opacity-0" data-drawer style="transition: opacity 0.25s ease, display 0.25s allow-discrete;">
    <div ref="wrapper" :class="[props['class:overlay']]" class="absolute inset-0 bg-black/20 overflow-hidden" @click="onClickOverlay">
      <div v-bind="$attrs" ref="drawer" role="dialog"
           class="absolute right-0 inset-y-0 min-w-[24rem] bg-white transition-transform duration-[0.25s] starting:translate-x-full
           after:content-[''] after:absolute after:inset-y-0 after:right-full after:w-4 after:bg-gradient-to-l after:from-black/15
      ">
        <slot/>
      </div>
    </div>
  </div>
</template>