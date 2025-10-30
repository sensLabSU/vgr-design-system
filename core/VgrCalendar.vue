<script setup lang="ts">
import {computed, nextTick, Ref, ref} from "vue";
import {calendarOutline, chevronLeft, chevronRight} from "../icons";
import {VgrStack, VgrButton, VgrTooltip} from "./index";
import {DateTime, now} from "../util/now";
import VgrCalendarFace from "./VgrCalendarFace.vue";

const props = defineProps<{
  openTo?: null | Date | string;
  showToday?: boolean;
  fixedWeeks?: boolean;
  showWeeks?: boolean;
  hideNavigation?: boolean;
  size?: null | 'default' | 'small' | 'large';
  locale?: string;
  static?: boolean;
  min?: null | Date | string;
  max?: null | Date | string;
  unavailable?: string[];
  multiple?: boolean;
  mode?: null | 'default' | 'range';
  months?: null | '1' | '2' | '3';
  value?: null | string | Date;
  selectableHeader?: boolean;
}>();

const model = defineModel();
model.value ||= props.value;

const resolvedLocale = computed(() => {
  return props.locale || navigator.language;
});

const cellSize = computed(() => {
  switch(props.size) {
    case 'small': return '!size-9';
    case 'large': return '!size-14';
    default: return '!size-11';
  }
});

const textSize = computed(() => {
  switch(props.size) {
    case 'small': return 'text-xs';
    case 'large': return 'text-lg';
    default: return 'text-sm';
  }
});

function resetToToday() {
  currentMonthAndYear.value = now().startOf('month');
  model.value = now().toISODateString();
}
function nextMonth() {
  currentMonthAndYear.value = currentMonthAndYear.value.add(1, 'month');
}
function prevMonth() {
  currentMonthAndYear.value = currentMonthAndYear.value.sub(1, 'month');
}

const currentMonthAndYear: Ref<DateTime> = ref(now(props.openTo ?? new Date()).startOf('month'));
const minDate: Ref<DateTime|null> = ref(props.min ? now(props.min).startOf('day') : null);
const maxDate: Ref<DateTime|null> = ref(props.max ? now(props.max).endOf('day') : null);
const unavailableDates = computed(() => {
  if(!props.unavailable) return [];
  return props.unavailable.map(d => now(d).toISODateString());
});

function toggleDate(date: DateTime) {
  const values = model.value || [];
  const v = date.toISODateString();

  if(values.includes(v)) {
    values.splice(values.indexOf(v), 1);
  } else {
    values.push(v);
  }

  model.value = null;
  nextTick(() => {
    model.value = values;
  });
}

function onChangeHeader(date: DateTime) {
  currentMonthAndYear.value = date.startOf('month');
}

function onClickDate(date: DateTime) {
  if(props.mode === 'range') {
    const [a,b] = (model.value || '').split('/');
    if(!model.value || (a && b)) {
      model.value = date.toISODateString();
    } else {
      const c = model.value;
      const d = date.toISODateString();
      model.value = c < d ? `${c}/${d}` : `${d}/${c}`;
    }
    return;
  }

  if(props.multiple) {
    toggleDate(date);
    return;
  }

  if(model.value === date.toISODateString()) {
    model.value = null;
    return;
  }

  model.value = date.toISODateString();
  currentMonthAndYear.value = now(date).startOf('month');
}
</script>

<template>
<div class="p-2 relative">
  <!-- Header -->
  <vgr-stack v-if="!hideNavigation" horizontal gap="x-small" class="absolute right-2 top-2">
    <vgr-tooltip v-if="showToday" text="Idag">
      <vgr-button variant="ghost" color="base" square size="small" :icon="calendarOutline" @click="resetToToday" class="dark:text-white"/>
    </vgr-tooltip>
    <vgr-button :disabled="minDate && minDate.startOf('month') >= currentMonthAndYear" variant="ghost" color="base" square size="small" :icon="chevronLeft" icon:class="size-5" @click="prevMonth" class="dark:text-white"/>
    <vgr-button :disabled="maxDate && maxDate.startOf('month') <= currentMonthAndYear" variant="ghost" color="base" square size="small" :icon="chevronRight" icon:class="size-5" @click="nextMonth" class="dark:text-white"/>
  </vgr-stack>

  <!-- Content -->
  <div class="flex items-start gap-5">
    <vgr-calendar-face :show="currentMonthAndYear"
                       :fixed-weeks="fixedWeeks"
                       :show-weeks="showWeeks"
                       :size="size"
                       :locale="resolvedLocale"
                       :static="static"
                       :min="minDate"
                       :max="maxDate"
                       :unavailable="unavailableDates"
                       :cell-size="cellSize"
                       :text-size="textSize"
                       :model="model"
                       :multiple="multiple"
                       :mode="mode"
                       :selectable-header="selectableHeader"
                       @on-click-date="onClickDate"
                       @on-change-header="onChangeHeader"
    />
    <template v-if="mode === 'range'">
      <template v-for="i in (+months || 2) - 1" :key="i">
        <vgr-calendar-face :show="currentMonthAndYear.add(i, 'month')"
                           :fixed-weeks="fixedWeeks"
                           :show-weeks="showWeeks"
                           :size="size"
                           :locale="resolvedLocale"
                           :static="static"
                           :min="minDate"
                           :max="maxDate"
                           :unavailable="unavailableDates"
                           :cell-size="cellSize"
                           :text-size="textSize"
                           :model="model"
                           :multiple="multiple"
                           :mode="mode"
                           @on-click-date="onClickDate"
        />
      </template>
    </template>
  </div>
</div>
</template>

<style scoped>
:deep(td[data-today] > *:after) {
  @apply content-[''] absolute size-1 bg-current left-1/2 bottom-[15%] -translate-x-1/2 rounded-full opacity-65;
}
:deep(tr > td > *) {
  @apply rounded-lg;
}
:deep(tr > td[data-selected] + td[data-selected] > *),
:deep(tr > td[data-in-range] + td[data-selected] > *),
:deep(tr > td[data-selected] + td[data-in-range] > *),
:deep(tr > td[data-in-range] + td[data-in-range] > *) {
  @apply !rounded-l-none;
}
:deep(tr > td[data-selected]:has(+ td[data-selected]) > *),
:deep(tr > td[data-in-range]:has(+ td[data-selected]) > *),
:deep(tr > td[data-selected]:has(+ td[data-in-range]) > *),
:deep(tr > td[data-in-range]:has(+ td[data-in-range]) > *) {
  @apply !rounded-r-none;
}
</style>