<script setup lang="ts">
import type {Ref} from "vue";
import {computed, provide, ref, watch} from "vue";
import {searchOutline} from "../icons";
import {VgrButton, VgrIcon} from "./index";
import VgrModal from "./VgrModal.vue";

const modal: Ref<typeof VgrModal> = ref(null as unknown as typeof VgrModal);
const inputEl: Ref<HTMLInputElement> = ref(null as unknown as HTMLInputElement);
const itemListEl: Ref<HTMLElement> = ref(null as unknown as HTMLElement);
const search: Ref<string> = ref('');
const selectedIndex: Ref<number> = ref(0);
const hasFocus: Ref<boolean> = ref(false);
const numResults: Ref<number> = ref(0);

function present() {
  search.value = '';
  modal.value.present();
  inputEl.value.focus();

  numResults.value = children.value.length;
}

function dismiss() {
  modal.value.dismiss();
}

provide('closeMenu', () => dismiss());

function onFocus() {
  hasFocus.value = true;
  selectedIndex.value = 0;
  updateHighlight();
}

function onBlur() {
  hasFocus.value = false;
  selectedIndex.value = -1;
  updateHighlight();
}

function filteredChildren() {
  return children.value.filter(c => ['A','BUTTON'].includes(c.tagName) && !c.classList.contains('hidden'));
}

function onKeyDown(e: KeyboardEvent) {
  if(selectedIndex.value < 0) {
    return;
  }

  if(e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredChildren().length - 1);
    updateHighlight();
    return;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    updateHighlight();
    return;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const filtered = filteredChildren();
    if(filtered.length <= 0) return;

    const child = filtered[selectedIndex.value];
    (child as HTMLElement).click();
    return;
  }
}

function updateHighlight() {
  children.value.forEach(c => {
    c.classList.remove('highlight');
  });

  if(selectedIndex.value < 0) return;

  const filtered = filteredChildren();
  if(filtered.length > 0) {
    filtered[selectedIndex.value].classList.add('highlight');
  }
}

const children = computed(() => [...((itemListEl.value?.children || []) as any)]);

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
      if(['A','BUTTON'].includes(c.tagName) && c.textContent!.toLowerCase().includes(s)) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
    numResults.value = filteredChildren().length;
  }

  updateHighlight();
});

function onMouseMove(e: MouseEvent) {
  const el = (e.target! as HTMLElement).closest('a,button');
  if(!el) return;

  const filtered = filteredChildren();
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
  <vgr-modal ref="modal" class:body="!p-0" data-command-palette>
    <div class="flex items-center gap-2 px-4 py-2">
      <vgr-icon :icon="searchOutline" class="size-5 text-neutral-50"/>
      <input ref="inputEl" v-model="search" type="text"
             @keydown="onKeyDown" @focus="onFocus" @blur="onBlur"
             class="p-2 flex-1 border-none outline-0" placeholder="Sök..."/>
      <vgr-button variant="outline" color="neutral" size="small" class="!border border-neutral-70" @click="dismiss">Esc</vgr-button>
    </div>

    <div ref="itemListEl" class="border-t border-black/20 p-2" @mousemove="onMouseMove">
      <slot/>
    </div>

    <div v-if="search && numResults <= 0" class="p-5 text-center font-lg text-neutral-70">
      Inga resultat för "<span class="text-black">{{ search }}</span>"
    </div>
  </vgr-modal>
</template>