<script setup lang="ts">
import {computed} from "vue";
import {DateTime, now} from "../util/now";
import {VgrButton, VgrSelect, VgrOption} from "./index";

const props = defineProps<{
  show: DateTime;
  fixedWeeks?: boolean;
  showWeeks?: boolean;
  size?: null | 'default' | 'small' | 'large';
  locale?: string;
  static?: boolean;
  min?: null | DateTime;
  max?: null | DateTime;
  unavailable?: string[];
  cellSize: string;
  textSize: string;
  multiple?: boolean;
  model: any;
  mode?: null | 'default' | 'range';
  selectableHeader?: boolean;
}>();

const emit = defineEmits<{
  'on-click-date': [DateTime];
  'on-change-header': [DateTime];
}>();

function emitHeaderChange(month, year) {
  emit('on-change-header', now(year + '-' + month + '-1'));
}

const selectedMonth = computed({
  get: () => props.show.getMonth() + 1,
  set(value) {
    emitHeaderChange(value, selectedYear.value);
  }
});

const selectedYear = computed({
  get: () => props.show.getFullYear(),
  set(value) {
    emitHeaderChange(selectedMonth.value, value);
  }
});

const years = computed(() => {
  const y = now().getFullYear();
  const arr = [];

  for(let i = y - 100; i <= y + 10; i++) {
    arr.push(i);
  }

  return arr;
})

const calendarRows = computed(() => {
  const firstWeekDayOfMonth = props.show.startOf('month').getUTCDay();
  const daysInMonth = props.show.endOf('month').getDate();
  const dates = [];

  let loopDate = props.show.startOf('month').sub(firstWeekDayOfMonth, 'days');

  for(let i = 0; i < firstWeekDayOfMonth; i++) {
    dates.push({
      value: now(loopDate),
      outside: true,
      disabled: (props.min !== null && loopDate < props.min) || (props.max !== null && loopDate > props.max),
      unavailable: props.unavailable.includes(loopDate.toISODateString()),
    });
    loopDate = loopDate.add(1, 'day');
  }

  for(let i = 0; i < daysInMonth; i++) {
    dates.push({
      value: now(loopDate),
      outside: false,
      disabled: (props.min !== null && loopDate < props.min) || (props.max !== null && loopDate > props.max),
      unavailable: props.unavailable.includes(loopDate.toISODateString()),
    });
    loopDate = loopDate.add(1, 'day');
  }

  const daysRemaining = props.fixedWeeks ? (42 - (firstWeekDayOfMonth + daysInMonth)) : (7 - (firstWeekDayOfMonth + daysInMonth) % 7);
  for(let i = 0; i < daysRemaining; i++) {
    dates.push({
      value: now(loopDate),
      outside: true,
      disabled: (props.min !== null && loopDate < props.min) || (props.max !== null && loopDate > props.max),
      unavailable: props.unavailable.includes(loopDate.toISODateString()),
    });
    loopDate = loopDate.add(1, 'day');
  }

  return dates.reduce((all,one,i) => {
    const ch = Math.floor(i/7);
    all[ch] = [].concat((all[ch]||[]),one);
    return all
  }, [])
});

const headerRow = computed(() => {
  const headers = [];
  let loopDate = now().startOf('week');

  for(let i = 0; i < 7; i++) {
    headers.push(loopDate.format('dd', props.locale));
    loopDate = loopDate.add(1, 'day');
  }

  return headers;
});

function onClickDate(date: DateTime) {
  emit('on-click-date', date);
}

function isSelected(date: DateTime): boolean {
  const v = date.toISODateString();

  if(props.mode === 'range') {
    if(!props.model) return false;

    const [a, b] = props.model.split('/');

    return v === a || v === b;
  }

  if(props.multiple) {
    return (props.model || []).includes(v);
  }

  return v === props.model;
}

function inRange(date: DateTime): boolean {
  const v = date.toISODateString();

  if(props.mode !== 'range') return false;

  const [a, b] = props.model.split('/');

  return b && v >= a && v <= b;
}

function translatedMonth(date: Date) {
  return date.toLocaleDateString(props.locale, {month: props.size === 'small' ? 'short' : 'long'});
}
function translatedMonthAndYear(date: Date) {
  return date.toLocaleDateString(props.locale, {month: 'long', year: 'numeric'});
}
</script>

<template>
  <div>
    <div class="h-7 flex items-center gap-2">
      <template v-if="selectableHeader">
        <vgr-select v-model="selectedMonth" class="!h-7 !w-auto" select:class="!h-7 !pl-1.5 pr-7 !py-0 !leading-7 !border-none !shadow-none !bg-base-90">
          <vgr-option v-for="m in 12" :key="m" :value="m">{{ translatedMonth(now('2025-' + m + '-1')) }}</vgr-option>
        </vgr-select>
        <vgr-select v-model="selectedYear" class="!h-7 !w-auto" select:class="!h-7 !pl-1.5 pr-7 !py-0 !leading-7 !border-none !shadow-none !bg-base-90">
          <vgr-option v-for="y in years" :key="y" :value="y">{{ y }}</vgr-option>
        </vgr-select>
      </template>
      <div v-else :class="[textSize]" class="font-medium leading-7 mb-2 pl-3">{{ translatedMonthAndYear(show) }}</div>
    </div>

    <table>
      <thead>
      <tr class="flex w-full">
        <th v-if="showWeeks" :class="[cellSize, textSize]" class="flex items-center text-black/35 dark:text-white/35 font-normal">
          <div class="w-full flex items-center justify-center">#</div>
        </th>
        <th v-for="(header, i) in headerRow" :key="i" :class="[cellSize, textSize]" class="flex items-center text-black/40 dark:text-white/40 font-normal">
          <div class="w-full flex items-center justify-center">{{ header }}</div>
        </th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(row, i) in calendarRows" :key="i">
        <tr class="flex w-full mt-1 first:mt-0">
          <td v-if="showWeeks" :class="[cellSize, textSize]" class="flex-0 flex items-center text-black/50 dark:text-white/50 font-normal">
            <div class="w-full flex items-center justify-center text-[75%]">{{ row[0].value.getWeek() }}</div>
          </td>
          <td v-for="(day, j) in row" :key="j"
              :class="[cellSize, textSize]"
              class="flex-0 flex items-center"
              :data-outside="day.outside || null"
              :data-unavailable="day.unavailable || null"
              :data-disabled="day.disabled || null"
              :data-today="day.value.is('today') || null"
              :data-selected="isSelected(day.value) || null"
              :data-in-range="inRange(day.value) || null"
          >
            <div v-if="static || day.disabled || day.unavailable"
                 class="w-full h-full flex items-center justify-center relative text-black dark:text-white font-medium
                   [[data-unavailable]>&]:line-through [[data-unavailable]>&]:opacity-50 [[data-outside]>&]:opacity-50
                   [[data-disabled]>&]:opacity-50 [[data-selected]>&]:!bg-healthcare [[data-selected]>&]:text-white
                    dark:[[data-selected]>&]:!bg-white dark:[[data-selected]>&]:text-black
                    [[data-in-range]>&]:bg-healthcare/15 dark:[[data-in-range]>&]:bg-white/10"
            >
              {{ day.value.getDate() }}
            </div>
            <vgr-button v-else variant="ghost" color="base"
                        :class="[cellSize, textSize]"
                        class="relative transition-none text-black dark:text-white font-medium flex-none
                          [[data-outside]>&]:opacity-50 [[data-selected]>&]:!bg-healthcare [[data-selected]>&]:text-white
                          dark:[[data-selected]>&]:!bg-white dark:[[data-selected]>&]:text-black
                          [[data-in-range]>&]:bg-healthcare/15 dark:[[data-in-range]>&]:bg-white/10"
                        @click="onClickDate(day.value)"
            >
              {{ day.value.getDate() }}
            </vgr-button>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>