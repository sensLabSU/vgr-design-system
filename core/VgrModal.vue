<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import VgrCard from "./VgrCard.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  open?: any;
  'class:header'?: string;
  'class:body'?: string;
  'class:footer'?: string;
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
const card = ref();

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
  card.value.$el.classList.toggle('-translate-y-[4rem]', closing);

  document.body.classList.toggle('overflow-hidden', !closing);

  if(!closing) {
    setTimeout(() => wrapper.value.scrollTo(0,0), 0);
  }

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
  <div ref="popover" popover="manual" class="size-full fixed bg-transparent starting:opacity-0" data-modal style="transition: opacity 0.25s ease, display 0.25s allow-discrete;">
    <div ref="wrapper" :class="[props['class:overlay']]" class="absolute inset-0 bg-black/20 py-40 overflow-y-auto" @click="onClickOverlay">
      <vgr-card v-bind="$attrs" ref="card" role="dialog" class="min-w-[40rem] max-w-full w-min mx-auto transition-transform duration-[250] starting:-translate-y-[4rem]">
        <header v-if="$slots.header" :class="[props['class:header']]" class="p-5 border-b border-black/20">
          <slot name="header"/>
        </header>

        <main class="p-5" :class="[props['class:body']]">
          <slot/>
        </main>

        <footer v-if="$slots.footer" :class="[props['class:footer']]" class="p-5 border-t border-black/20">
          <slot name="footer"/>
        </footer>
      </vgr-card>
    </div>
  </div>
</template>