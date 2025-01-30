<script setup lang="ts">
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
  'blue': {stroke: 'stroke-blue-70', fill: 'fill-blue-70', bg: 'bg-blue-70'},
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
    return new Date(xAxis.value.start);
  }

  let from = null;

  graphs.value.forEach(graph => {
    const s = new Date(graph.start);

    if(from === null || s < from) from = s;
  });

  return from;
});

const xAxisTimeEnd = computed(() => {
  if(!xAxis.value || xAxis.value.type !== 'time') return null;

  if(xAxis.value.end) {
    return new Date(xAxis.value.end);
  }

  let to = null;

  graphs.value.forEach(graph => {
    const e = new Date(graph.end);

    if(to === null || e < to) to = e;
  });

  return to;
});

const xAxisTimeSeconds = computed(() => {
  if(!xAxisTimeStart.value || !xAxisTimeEnd.value) return null;

  return (xAxisTimeEnd.value - xAxisTimeStart.value) / 1000;
});

function xAxisTimeLabels() {
  const span = (xAxisTimeEnd.value - xAxisTimeStart.value) / 1000;

  if(span > 24 * 3600) {
    throw new Error('Sleep data can only be displayed for 1 day!');
  }

  const labels = [];

  let t = new Date(+(new Date(xAxisTimeStart.value)).setMinutes(0, 0, 0) + 3600_000);
  const numHours = (xAxisTimeEnd.value - xAxisTimeStart.value) / 3600_000;
  const step = size.width ? Math.max(1, (Math.ceil(48 / (size.width / numHours)))) : 1;

  while(t < xAxisTimeEnd.value) {
    labels.push({
      left: (((t - xAxisTimeStart.value) / 1000) / span) * 100 + '%',
      text: t.toLocaleTimeString().substring(3),
    });

    t = new Date(+t + (step * 3600_000));
  }

  return labels;
}

const xAxisLabelModulo = computed(() => {
  return Math.max(1, Math.ceil(40 / sectionSize.value));
});
const xAxisLabelModuloComparer = computed(() => {
  return Math.floor(xAxisLabelModulo.value / 2);
})

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
  getCenter(): [number, number] {
    return [
        size.width / 2,
        size.height / 2,
    ];
  },
  getX(index: number, dataPoint: any): number {
    if(xAxis.value?.type === 'time') {
      if(typeof dataPoint !== 'object') throw new Error('Data points needs to be objects when using type="time" for VgrXAxis!');
      if(!dataPoint.dateTime) throw new Error('Data points need a dateTime property when using type="time" for VgrXAxis!');
      return ((new Date(dataPoint.dateTime) - xAxisTimeStart.value) / (xAxisTimeEnd.value - xAxisTimeStart.value)) * size.width;
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
  getCircularTotal(): number {
    return graphs.value.filter(g => ['donut','pie'].includes(g.type)).reduce((a, c) => a + c.values, 0) || 1;
  },
  getCircularIndex(graph: Graph): number {
    return graphs.value.filter(g => ['donut','pie'].includes(g.type)).indexOf(graph);
  },
  getCircularOffset(graph: Graph): number {
    const donutGraphs = graphs.value.filter(g => ['donut','pie'].includes(g.type));
    const index = donutGraphs.indexOf(graph);
    const total = donutGraphs.reduce((a, c) => a + c.values, 0);

    let acc = 0;
    for(let i = 0; i < index; i++) {
      acc += donutGraphs[i].values;
    }

    return acc / total;
  },
  getCircularRadius(): number {
    const rad = Math.min(size.width, size.height) / 2;

    if(graphs.value.filter(g => ['donut','pie']).some(g => g.extrude === true)) {
      return rad * 0.8;
    }

    return rad;
  }
});

const tooltip = ref(null);
function onMouseMove(e) {
  if(!xAxis.value || xAxis.value.type === 'time') return;

  const t = Math.max(0, Math.min(0.99999, (e.clientX - e.target.offsetLeft) / e.target.offsetWidth));
  const s = Math.max(0, Math.min(numSections.value - 1, Math.floor(t * numSections.value)));

  tooltip.value = {
    section: s,
    left: s * sectionSize.value + sectionSize.value * 0.5 + 'px',
    label: xAxis.value.labels[s],
    graphs: graphs.value.filter(g => {
      return g.data || g.segments;
    }).map(g => {
      const v = g.data?.[s] ?? null;

      return {
        name: g.name,
        color: getColor(g.color),
        value: v ? (g.format ? formatString(g.format, v) : v) : '-',
      };
    }),
  }
}

function onMouseLeave(e) {
  tooltip.value = null;
}

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
  <div class="aspect-[2/1] w-full flex flex-col gap-2" data-chart>
    <vgr-stack v-if="legend && !legend.bottom" horizontal class="w-full pb-2 flex-wrap gap-y-1" :class="legend.class || null" :align="legend.align || null">
      <template v-for="(graph, graphIndex) in graphs" :key="graphIndex">
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
        <div class="flex-1 relative" :class="{'border-b border-neutral-80': !!xAxis}" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
          <div ref="graphWrapper" class="absolute inset-0 pointer-events-none z-10">
            <svg v-if="size.width > 0" class="w-full h-auto -my-1" :viewBox="`0 -4 ${size.width} ${size.height + 8}`" preserveAspectRatio="none">
              <template v-for="(graph, seriesIndex) in graphs" :key="seriesIndex">
                <component :is="graph.paths" />
              </template>
            </svg>
            <div v-if="$slots['donut-center']" class="absolute inset-0 flex flex-col items-center justify-center">
              <slot name="donut-center"/>
            </div>
          </div>

          <div v-if="tooltip" :style="{left: tooltip.left}"
               class="absolute bottom-full -translate-x-1/2 bg-white z-50 text-sm rounded-md border border-neutral-80 px-2 py-1 shadow pointer-events-none">
            <slot name="tooltip" v-bind="tooltip">
              <div class="text-neutral-60">{{ tooltip.label }}</div>
              <div class="grid grid-cols-[auto,auto,auto] items-center gap-x-1 *:whitespace-nowrap">
                <template v-for="graph in tooltip.graphs" :key="graph.name">
                  <span class="block size-2 rounded-full" :class="[graph.color.bg]"></span>
                  <span>{{ graph.name }}:</span>
                  <span class="font-bold">{{ graph.value }}</span>
                </template>
              </div>
            </slot>
          </div>
          <div v-if="tooltip" :style="{left: tooltip.left}"
               class="z-0 absolute inset-y-0 w-px bg-neutral-90 pointer-events-none"></div>
        </div>
        <!-- X Axis -->
        <template v-if="xAxis">
          <div v-if="xAxis.type === 'time'" class="relative h-5 text-xs text-neutral-60" :class="xAxis.class || null" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
            <template v-for="(label, index) in xAxisTimeLabels()" :key="index">
              <i class="absolute top-0 translate-x-[-0.5px] w-px h-1 bg-neutral-80 pointer-events-none" :style="{left: label.left}"></i>
              <span class="absolute top-1 leading-4 -translate-x-1/2 pointer-events-none" :style="{left: label.left}">{{ label.text }}</span>
            </template>
          </div>
          <div v-else class="h-5 text-2xs text-neutral-60 relative" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
            <i v-for="(label, index) in xAxis.labels" :key="index" :style="{left: (index / numSections) * 100 + (50 / numSections) + '%'}"
               class="absolute top-0 translate-x-[-0.5px] w-px h-1 bg-neutral-80 pointer-events-none"></i>

            <template v-for="(label, index) in xAxis.labels" :key="index">
              <span v-if="(index % xAxisLabelModulo) === xAxisLabelModuloComparer" :style="{left: (index / numSections) * 100 + (50 / numSections) + '%'}"
                    class="absolute top-1 leading-4 text-center text-ellipsis line-clamp-1 whitespace-nowrap -translate-x-1/2 pointer-events-none">
                {{ label }}
              </span>
            </template>
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
    <vgr-stack v-if="legend && legend.bottom" horizontal class="w-full pb-2 flex-wrap gap-y-1" :class="legend.class || null" :align="legend.align || null">
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
    <slot/>
  </div>
</template>