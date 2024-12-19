<script setup lang="ts">
import dayjs from "dayjs";
import {computed, onBeforeUnmount, onMounted, provide, reactive, Ref, ref} from "vue";
import {VgrStack} from "../core";
import {Graph} from "../types";
import {formatString, resolveColor} from "../util";

const colors = {
  'black': {stroke: 'stroke-black', fill: 'fill-black', bg: 'bg-black'},
  'white': {stroke: 'stroke-white', fill: 'fill-white', bg: 'bg-white'},
  'neutral': {stroke: 'stroke-neutral', fill: 'fill-neutral', bg: 'bg-neutral'},
  'healthcare': {stroke: 'stroke-healthcare-50', fill: 'fill-healthcare-50', bg: 'bg-healthcare-50'},
  'culture': {stroke: 'stroke-culture', fill: 'fill-culture', bg: 'bg-culture'},
  'education': {stroke: 'stroke-education', fill: 'fill-education', bg: 'bg-education'},
  'base': {stroke: 'stroke-base', fill: 'fill-base', bg: 'bg-base'},
  'error': {stroke: 'stroke-error', fill: 'fill-error', bg: 'bg-error'},
  'purple': {stroke: 'stroke-purple', fill: 'fill-purple', bg: 'bg-purple'},
  'brown': {stroke: 'stroke-brown', fill: 'fill-brown', bg: 'bg-brown'},
  'cyan': {stroke: 'stroke-cyan', fill: 'fill-cyan', bg: 'bg-cyan'},
  'green': {stroke: 'stroke-green', fill: 'fill-green', bg: 'bg-green'},
  'lime': {stroke: 'stroke-lime', fill: 'fill-lime', bg: 'bg-lime'},
  'orange': {stroke: 'stroke-orange', fill: 'fill-orange', bg: 'bg-orange'},
  'pink': {stroke: 'stroke-pink', fill: 'fill-pink', bg: 'bg-pink'},
  'yellow': {stroke: 'stroke-yellow-70', fill: 'fill-yellow-70', bg: 'bg-yellow-70'},
};

const graphWrapper: Ref<HTMLElement> = ref();
const legend: Ref<object|null> = ref(null);
const leftAxi: Ref<object[]> = ref([]);
const rightAxi: Ref<object[]> = ref([]);
const xAxis: Ref<object|null> = ref(null);
const graphs: Ref<Graph[]> = ref([]);
const size = reactive({width: 0, height: 0});
const numSections = computed(() => {
    let n = xAxis.value?.labels?.length ?? 0;

    graphs.value.forEach(graph => {
        if((graph.values?.length ?? 0) > n) n = graph.values?.length;
    });

    return n;
});
const sectionSize = computed(() => {
    if(size.width <= 0 || numSections.value <= 0) return 0;

    return size.width / numSections.value;
});
const numBars = computed(() => {
  let n = 0;

  graphs.value.forEach(graph => {
    if(graph.type === 'bar') n++;
  });

  return n;
});
const barOffsets = computed(() => {
  const offsets = {};
  let offset = 0;

  graphs.value.forEach(graph => {
    if(graph.type === 'bar') {
      offsets[graph.id] = offset++;
    };
  });

  return offsets;
});
const barGap = computed(() => {
  if(numBars.value <= 1) return 0;
  return (sectionSize.value * 0.05) / (numBars.value - 1);
});
const barWidth = computed(() => {
  return Math.min(sectionSize.value * 0.2, (sectionSize.value * 0.75 - barGap.value * (numBars.value - 1) ) / numBars.value);
});
const barsOffset = computed(() => {
  return ((barWidth.value * numBars.value) + (barGap.value * (numBars.value - 1))) / 2;
});
const barRadius = computed(() => {
  return barWidth.value * 0.25;
});
const noAxis = computed(() => {
  const axis = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};

  graphs.value.forEach(graph => {
    if(graph.type === 'bar') {
      axis.min = Math.min(0, axis.min);
    }

    if(graph.values?.length) {
      graph.values.forEach(dp => {
        if(dp < axis.min) axis.min = dp;
        if(dp > axis.max) axis.max = dp;
      });
    }
  });

  return axis;
});

const xAxisTimeStart = computed(() => {
  if(!xAxis.value || xAxis.value.type !== 'time') return null;

  if(xAxis.value.start) {
    return dayjs(xAxis.value.start);
  }

  let from = null;

  graphs.value.forEach(graph => {
    const s = dayjs(graph.start);

    if(from === null || s < from) from = s;
  });

  return from;
});

const xAxisTimeEnd = computed(() => {
  if(!xAxis.value || xAxis.value.type !== 'time') return null;

  if(xAxis.value.end) {
    return dayjs(xAxis.value.end);
  }

  let to = null;

  graphs.value.forEach(graph => {
    const e = dayjs(graph.end);

    if(to === null || e < to) to = e;
  });

  return to;
});

const xAxisTimeSeconds = computed(() => {
  if(!xAxisTimeStart.value || !xAxisTimeEnd.value) return null;

  return xAxisTimeEnd.value.diff(xAxisTimeStart.value, 'seconds');
});

function xAxisTimeLabels() {
  const span = (xAxisTimeEnd.value - xAxisTimeStart.value) / 1000;

  if(span > 24 * 3600) {
    throw new Error('Sleep data can only be displayed for 1 day!');
  }

  const labels = [];

  let t = xAxisTimeStart.value.startOf('hour').add(1, 'hour');
  const numHours = xAxisTimeEnd.value.diff(xAxisTimeStart.value, 'hours');
  const step = size.width ? Math.max(1, (Math.ceil(48 / (size.width / numHours)))) : 1;

  while(t < xAxisTimeEnd.value) {
    labels.push({
      left: (((t - xAxisTimeStart.value) / 1000) / span) * 100 + '%',
      text: t.format('HH:mm'),
    });

    t = t.add(step, 'hour');
  }

  return labels;
}

function getColor(name: string): object {
  const c = resolveColor(name);
  return (typeof c === 'string') ? colors[c] : c;
}

provide('chart', {
  addLegend(options) {
    legend.value = options;
  },
  removeLegend(id) {
    legend.value = null;
  },
  addYAxis(options) {
    if(options.right) {
      rightAxi.value.push(options);
    } else {
      leftAxi.value.push(options);
    }
  },
  removeYAxis(id) {
    rightAxi.value = rightAxi.value.filter(i => i.id !== id);
    leftAxi.value = leftAxi.value.filter(i => i.id !== id);
  },
  addXAxis(options) {
    xAxis.value = options;
  },
  removeXAxis(id) {
    xAxis.value = null;
  },
  addGraph(graph: Graph) {
    graphs.value.push(graph);
  },
  removeGraph(graph: Graph) {
    graphs.value = graphs.value.filter(i => i.id !== graph.id);
  },
  getAxis(identifier: string) {
    let axis = [...leftAxi.value, ...rightAxi.value]?.[0];

    if([...leftAxi.value, ...rightAxi.value].length > 1) {
      axis = [...leftAxi.value, ...rightAxi.value].filter(i => i.identifier === identifier)?.[0] ?? null;
      if(!axis) throw new Error(`Invalid axis '${identifier}' for series!`);
    }

    if(!axis) {
      axis = noAxis.value;
    }

    return axis;
  },
  getNumSections(): number {
    return numSections.value;
  },
  getSectionSize(): number {
    return sectionSize.value;
  },
  getWidth(): number {
    return size.width;
  },
  getHeight(): number {
    return size.height;
  },
  getX(index: number, dataPoint: any): number {
    if(xAxis.value?.type === 'time') {
      if(typeof dataPoint !== 'object') throw new Error('Data points needs to be objects when using type="time" for VgrXAxis!');
      if(!dataPoint.dateTime) throw new Error('Data points need a dateTime property when using type="time" for VgrXAxis!');
      return ((dayjs(dataPoint.dateTime) - xAxisTimeStart.value) / (xAxisTimeEnd.value - xAxisTimeStart.value)) * size.width;
    }

    return (index * sectionSize.value) + sectionSize.value * 0.5;
  },
  getY(dataPoint: any, min: number, max: number): number {
    const v = typeof dataPoint === 'object' ? dataPoint.value : dataPoint;
    return size.height - ((v - min) / (max - min)) * size.height;
  },
  getColor,
  getBarOffset(serie: Graph): number {
    return barOffsets.value[serie.id];
  },
  getBarWidth(): number {
    return barWidth.value;
  },
  getBarRadius(): number {
    return barRadius.value;
  },
  getBarSectionOffset(): number {
    return barsOffset.value;
  },
  getBarGap(): number {
    return barGap.value;
  },
  getXAxisStartTime() {
    return xAxisTimeStart.value;
  },
  getXAxisTimeSeconds() {
    return xAxisTimeSeconds.value;
  },
});

let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateSize, 300);
}
function updateSize() {
  size.width = graphWrapper.value?.clientWidth;
  size.height = graphWrapper.value?.clientHeight;
}

onMounted(() => {
  updateSize();
  window.addEventListener('resize', onResize);
});
onBeforeUnmount(() => {
  window.addEventListener('resize', onResize);
});
</script>

<template>
  <vgr-stack class="aspect-[2/1] w-full" gap="small">
    <vgr-stack v-if="legend" horizontal class="w-full pb-2 flex-wrap gap-y-1" :class="legend.class || null" :align="legend.align || null">
      <template v-for="(graph, index) in graphs" :key="index">
        <div v-if="graph.name" class="flex items-center gap-2 text-sm">
          <template v-if="graph.type === 'line'">
            <span v-if="graph.detail === 'square'" class="block size-[7.5px]" :class="[getColor(graph.color).bg]"></span>
            <svg v-else-if="graph.detail === 'triangle'" viewBox="0 0 10 9" width="10" height="9">
              <path d="M5,0 L10,9 0,9 Z" class="stroke-none" :class="[getColor(graph.color).fill]"/>
            </svg>
            <span v-else class="block size-2 rounded-full" :class="[getColor(graph.color).bg]"/>
          </template>
          <span v-else class="block size-2 rounded-[2px]" :class="[getColor(graph.color).bg]"/>
          <span>{{ graph.name }}</span>
        </div>
      </template>
    </vgr-stack>

    <div class="flex-1 flex w-full pt-2" :class="{'pb-2': !xAxis}">
      <div v-if="leftAxi?.length" class="flex gap-3" :class="{'pb-5': xAxis}">
        <template v-for="(axis, index) in leftAxi" :key="index">
          <div class="flex gap-1">
            <div v-if="axis.label" class="text-xs text-neutral-60 relative w-4">
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">{{ axis.label }}</div>
            </div>
            <div class="border-r border-neutral-80 text-2xs text-neutral-60 flex flex-col" :class="axis.class || null">
              <template v-if="axis.steps">
                <div class="flex flex-col-reverse justify-between items-end leading-4 -my-2 flex-1 pr-1">
                  <div v-for="(step, si) in axis.steps" :key="si">
                    {{ (typeof step === 'number' && axis.format) ? formatString(axis.format, step) : step }}
                  </div>
                </div>
              </template>
              <template v-else-if="axis.min !== undefined && axis.max !== undefined">
                <div class="flex flex-col justify-between items-end leading-4 -my-2 flex-1 pr-1">
                  <div>{{ formatString(axis.format ?? '{0:N0}', axis.max) }}</div>
                  <div>{{ formatString(axis.format ?? '{0:N0}', axis.min) }}</div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1 border-b border-neutral-80 relative">
          <div ref="graphWrapper" class="absolute inset-0">
            <svg v-if="size.width > 0" class="w-full h-auto -my-1" :viewBox="`0 -4 ${size.width} ${size.height + 8}`" preserveAspectRatio="none">
              <template v-for="(graph, seriesIndex) in graphs" :key="seriesIndex">
                <component :is="graph.paths" />
              </template>
            </svg>
          </div>
        </div>
        <!-- X Axis -->
        <template v-if="xAxis">
          <div v-if="xAxis.type === 'time'" class="relative h-5 text-xs text-neutral-60" :class="xAxis.class || null">
            <template v-for="(label, index) in xAxisTimeLabels()" :key="index">
              <i class="absolute top-0 translate-x-[-0.5px] w-px h-1 bg-neutral-80" :style="{left: label.left}"></i>
              <span class="absolute top-1 leading-4 -translate-x-1/2" :style="{left: label.left}">{{ label.text }}</span>
            </template>
          </div>
          <div v-else class="h-5 text-xs text-neutral-60 flex">
            <div v-for="(label, index) in xAxis.labels" :key="index" class="flex-1 relative h-5" :class="xAxis.class || null">
              <i class="absolute left-1/2 top-0 translate-x-[-0.5px] w-px h-1 bg-neutral-80"></i>
              <span class="absolute block inset-x-1 top-1 leading-4 text-center text-ellipsis line-clamp-1">{{ label }}</span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="rightAxi?.length" class="flex gap-3" :class="{'pb-5': xAxis}">
        <template v-for="(axis, index) in rightAxi" :key="index">
          <div class="flex gap-1">
            <div class="border-l border-neutral-80 text-2xs text-neutral-60 flex flex-col" :class="axis.class || null">
              <template v-if="axis.steps">
                <div class="flex flex-col-reverse justify-between items-start leading-4 -my-2 flex-1 pl-1">
                  <div v-for="(step, si) in axis.steps" :key="si">
                    {{ (typeof step === 'number' && axis.format) ? formatString(axis.format, step) : step }}
                  </div>
                </div>
              </template>
              <template v-else-if="axis.min !== undefined && axis.max !== undefined">
                <div class="flex flex-col justify-between items-start leading-4 -my-2 flex-1 pl-1">
                  <div>{{ formatString(axis.format ?? '{0:N0}', axis.max) }}</div>
                  <div>{{ formatString(axis.format ?? '{0:N0}', axis.min) }}</div>
                </div>
              </template>
            </div>
            <div v-if="axis.label" class="text-xs text-neutral-60 relative w-4">
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap">{{ axis.label }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <slot/>
  </vgr-stack>
</template>