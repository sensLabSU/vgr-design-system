<script setup lang="ts">
import {computed, provide, Ref, ref, watch} from "vue";
import {searchOutline} from "../icons";
import {VgrCard, VgrButton, VgrIcon} from "./index";

const props = defineProps<{
  popover?: boolean;
}>();

const popoverEl: Ref<HTMLElement> = ref();
const inputEl: Ref<HTMLElement> = ref();
const itemListEl: Ref<HTMLElement> = ref();
const search = ref('');
const selectedIndex = ref(0);
const hasFocus = ref(false);
const numResults = ref(0);

function present() {
  if(!props.popover) return;

  search.value = '';
  popoverEl.value.showPopover();
  inputEl.value.focus();

  numResults.value = children.value.length;
}

function dismiss() {
  if(!props.popover) return;

  popoverEl.value.hidePopover();
}

provide('closeMenu', () => dismiss());

function onFocus() {
  hasFocus.value = true;
  selectedIndex.value = 0;
  updateHighlight();
}
function onKeyDown(e) {
  if(selectedIndex.value < 0) {
    return;
  }

  if(e.key === 'ArrowDown') {
    e.preventDefault();
    const filtered = children.value.filter(c => !c.classList.contains('hidden'));
    selectedIndex.value = Math.min(selectedIndex.value + 1, filtered.length - 1);
    updateHighlight();
    return;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    updateHighlight();
    return;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const filtered = children.value.filter(c => !c.classList.contains('hidden'));
    if(filtered.length <= 0) return;

    const child = filtered[selectedIndex.value];
    (child as HTMLElement).click();
    return;
  }
}

function updateHighlight() {
  children.value.forEach(c => {
    c.classList.remove('!bg-neutral-95');
  });

  const filtered = children.value.filter(c => !c.classList.contains('hidden'));
  if(filtered.length > 0) {
    filtered[selectedIndex.value].classList.add('!bg-neutral-95');
  }
}

const children = computed(() => [...itemListEl.value.children]);

watch(search, val => {
  selectedIndex.value = 0;
  const s = val.toLowerCase();

  if(!s.length) {
    children.value.forEach(c => {
      c.classList.remove('hidden');
    });
    numResults.value = children.value.length;
  } else {
    children.value.forEach(c => {
      if(c.textContent.toLowerCase().includes(s)) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
    numResults.value = children.value.filter(c => !c.classList.contains('hidden')).length;
  }

  updateHighlight();
});

function onMouseMove(e) {
  const el = e.target.closest('a,button');
  if(!el) return;

  const filtered = children.value.filter(c => !c.classList.contains('hidden'));
  if(filtered.indexOf(el) >= 0) {
    selectedIndex.value = filtered.indexOf(el);
    updateHighlight();
  }
}

defineExpose({
  present, dismiss,
});
</script>

<template>
  <div ref="popoverEl"
       :popover="popover ? 'auto' : null"
       class="bg-transparent p-0"
       :class="{
         'size-full backdrop:backdrop-blur-sm backdrop:bg-black/15': popover
       }"
  >
    <div class="absolute size-full" @click="dismiss"></div>
    <div class="absolute size-full pointer-events-none" :class="{'size-full pt-[10%]': popover}">
      <vgr-card class="shadow-xl overflow-hidden pointer-events-auto" :class="{'w-[40rem] max-w-[90vw] mx-auto': popover}" data-command-palette>
        <div class="flex items-center gap-2 px-4 py-2">
          <vgr-icon :icon="searchOutline" class="size-5 text-neutral-50"/>
          <input ref="inputEl" v-model="search" type="search"
                 @keydown="onKeyDown" @focus="onFocus" @blur="hasFocus = false"
                 class="p-2 flex-1 border-none outline-0" placeholder="Sök..."/>
          <vgr-button variant="outline" color="neutral" size="small" class="!border border-neutral-70" @click="dismiss">Esc</vgr-button>
        </div>

        <div ref="itemListEl" class="border-t border-neutral-90 p-1" @mousemove="onMouseMove">
          <slot/>
        </div>

        <div v-if="search && numResults <= 0" class="p-5 text-center font-lg text-neutral-70">
          Inga resultat för "<span class="text-black">{{ search }}</span>"
        </div>
      </vgr-card>
    </div>
  </div>
</template>