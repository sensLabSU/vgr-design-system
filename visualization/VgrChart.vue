<script setup lang="ts">
import dayjs from "dayjs";
import {computed, onBeforeUnmount, onMounted, provide, reactive, Ref, ref} from "vue";
import {VgrStack} from "../core";
import {formatString} from "../util";

const colors = {
  'blue': {stroke: 'stroke-healthcare-50', fill: 'fill-healthcare-50', bg: 'bg-healthcare-50'},
  'red': {stroke: 'stroke-culture', fill: 'fill-culture', bg: 'bg-culture'},
  'green': {stroke: 'stroke-green', fill: 'fill-green', bg: 'bg-green'},
  'yellow': {stroke: 'stroke-yellow-70', fill: 'fill-yellow-70', bg: 'bg-yellow-70'},
  'purple': {stroke: 'stroke-purple', fill: 'fill-purple', bg: 'bg-purple'},
  'black': {stroke: 'stroke-black', fill: 'fill-black', bg: 'bg-black'},
};

const graphWrapper: Ref<HTMLElement> = ref();
const legend: Ref<object|null> = ref(null);
const leftAxi: Ref<object[]> = ref([]);
const rightAxi: Ref<object[]> = ref([]);
const xAxis: Ref<object|null> = ref(null);
const series: Ref<object[]> = ref([]);
const size = reactive({width: 0, height: 0});
const numSections = computed(() => {
    let n = xAxis.value?.labels?.length ?? 0;

    series.value.forEach(serie => {
        if(serie.data?.length ?? 0 > n) n = serie.data?.length;
    });

    return n;
});
const sectionSize = computed(() => {
    if(size.width <= 0 || numSections.value <= 0) return 0;

    return size.width / numSections.value;
});
const numBars = computed(() => {
  let n = 0;

  series.value.forEach(serie => {
    if(serie.type === 'bar') n++;
  });

  return n;
});
const barOffsets = computed(() => {
  const offsets = {};
  let offset = 0;

  series.value.forEach(serie => {
    if(serie.type === 'bar') {
      offsets[serie.id] = offset++;
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
  return (sectionSize.value - barWidth.value * numBars.value) / 2 - (barGap.value * (numBars.value - 1)) / 2;
});
const barRadius = computed(() => {
  return barWidth.value * 0.25;
});
const noAxis = computed(() => {
  const axis = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};

  series.value.forEach(serie => {
    serie.data.forEach(dp => {
      if(dp < axis.min) axis.min = dp;
      if(dp > axis.max) axis.max = dp;
    });
  });

  return axis;
});

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
  addGraph(options) {
    series.value.push(options);
  },
  removeGraph(id) {
    series.value = series.value.filter(i => i.id !== id);
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

function getY(dataPoint, min, max): number {
  return size.height - ((dataPoint - min) / (max - min)) * size.height;
}

function linePath(serie: object): string {
  let axis = [...leftAxi.value, ...rightAxi.value]?.[0];

  if([...leftAxi.value, ...rightAxi.value].length > 1) {
    axis = [...leftAxi.value, ...rightAxi.value].filter(i => i.identifier === serie.axis)?.[0] ?? null;
    if(!axis) throw new Error(`Invalid axis '${serie.axis}' for series!`);
  }

  if(!axis) {
    axis = noAxis.value;
  }

  const [min, max] = [axis.min, axis.max];

  const points = [];

  const offset = sectionSize.value / 2.5;

  let prevWasData = false;
  for (let i = 0; i < serie.data.length; i++) {
    let dp = serie.data[i];

    if (dp !== null) {
      const y = getY(dp, min, max);
      const x = i * sectionSize.value + (sectionSize.value / 2);

      if (!prevWasData) {
        points.push(`M ${x} ${y}`);
      } else {
        if(serie.smooth) {
          const x1 = (i - 1) * sectionSize.value + (sectionSize.value / 2) + offset;
          const x2 = x - offset;

          const y1 = getY(serie.data[i - 1], min, max);
          const y2 = y;

          points.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
        } else {
          points.push(`L ${x} ${y}`);
        }
      }
    }

    prevWasData = dp !== null;
  }

  return points.join(' ');
}

function minMax(serie) {
  let axis = [...leftAxi.value, ...rightAxi.value]?.[0];

  if([...leftAxi.value, ...rightAxi.value].length > 1) {
    axis = [...leftAxi.value, ...rightAxi.value].filter(i => i.identifier === serie.axis)?.[0] ?? null;
    if(!axis) throw new Error(`Invalid axis '${serie.axis}' for series!`);
  }

  if(!axis) {
    axis = noAxis.value;
  }

  return [axis.min, axis.max];
}

function barPath(serie: object): string {
  let axis = [...leftAxi.value, ...rightAxi.value]?.[0];

  if([...leftAxi.value, ...rightAxi.value].length > 1) {
    axis = [...leftAxi.value, ...rightAxi.value].filter(i => i.identifier === serie.axis)?.[0] ?? null;
    if(!axis) throw new Error(`Invalid axis '${serie.axis}' for series!`);
  }

  if(!axis) {
    axis = noAxis.value;
  }

  const [min, max, offset] = [axis.min, axis.max, barOffsets.value[serie.id]];

  const paths = [];

  for (let i = 0; i < serie.data.length; i++) {
    const y1 = getY(Math.max(0, serie.data[i]), min, max);
    const y2 = getY(Math.min(0, serie.data[i]), min, max);
    const h = y2 - y1;
    const r = Math.min(barRadius.value, h * 0.5, barWidth.value * 0.5);

    const x1 = (i * sectionSize.value) + barsOffset.value + (offset > 0 ? barGap.value * offset : 0) + (barWidth.value * offset);
    const x2 = x1 + barWidth.value;

    if(serie.data[i] > 0) {
      paths.push(`M${x1},${y1 + r} C${x1} ${y1}, ${x1} ${y1}, ${x1 + r} ${y1} L${x2 - r},${y1} C${x2} ${y1}, ${x2} ${y1}, ${x2} ${y1 + r} L${x2},${y2} L${x1},${y2} Z`);
    } else {
      paths.push(`M${x1},${y1} L${x2},${y1} L${x2},${y2 - r} C${x2} ${y2},${x2} ${y2},${x2-r} ${y2} L${x1 + r} ${y2} C${x1} ${y2},${x1} ${y2},${x1} ${y2-r} Z`);
    }
  }

  return paths.join(' ');
}

const xAxisTimeStart = computed(() => {
  if(!xAxis.value || xAxis.value.type !== 'time') return null;

  let from = null;

  series.value.forEach(serie => {
    const s = dayjs(serie.start);

    if(from === null || s < from) from = s;
  });

  return from;
});

const xAxisTimeEnd = computed(() => {
  if(!xAxis.value || xAxis.value.type !== 'time') return null;

  let to = null;

  series.value.forEach(serie => {
    const e = dayjs(serie.end);

    if(to === null || e < to) to = e;
  });

  return to;
});

const xAxisTimeSeconds = computed(() => {
  if(!xAxisTimeStart.value || !xAxisTimeEnd.value) return null;

  return xAxisTimeEnd.value.diff(xAxisTimeStart.value, 'seconds');
});

function sleepLabels() {
  const span = (xAxisTimeEnd.value - xAxisTimeStart.value) / 1000;

  if(span > 24 * 3600) {
    throw new Error('Sleep data can only be displayed for 1 day!');
  }

  const labels = [];

  let t = xAxisTimeStart.value.startOf('hour').add(1, 'hour');
  while(t < xAxisTimeEnd.value) {
    labels.push({
      left: (((t - xAxisTimeStart.value) / 1000) / span) * 100 + '%',
      text: t.format('HH:mm'),
    });

    t = t.add(1, 'hour');
  }

  return labels;
}

function getSleepY(level) {
  const o = size.height * 0.015;
  switch(level) {
    case 'wake': return 0 - o;
    case 'rem': return 0.25 * size.height - o;
    case 'light': return 0.5 * size.height - o;
    case 'deep': return 0.75 * size.height - o;
  }
}

function sleepPath(serie) {

  let prevY1 = null;
  let prevY2 = null;
  let prevX2 = null;

  const n = serie.data.length;
  const path = [];
  const t = 0.5;

  for(let i = 0; i < n; i++) {
    const tl = i === 0 ? 0 : t;
    const tr = i === (n-1) ? 0 : t;

    const dataPoint = serie.data[i];

    const t1 = dayjs(dataPoint.dateTime).diff(xAxisTimeStart.value, 'seconds');
    const t2 = t1 + dataPoint.seconds;

    const x1 = (t1 / xAxisTimeSeconds.value) * size.width;
    const x2 = (t2 / xAxisTimeSeconds.value) * size.width;

    const nextX1 = i === (n-1) ? null : (dayjs(serie.data[i + 1].dateTime).diff(xAxisTimeStart.value, 'seconds') / xAxisTimeSeconds.value) * size.width;
    const nextY1 = i === (n-1) ? null : getSleepY(serie.data[i + 1].level);
    const y1 = getSleepY(dataPoint.level);
    const y2 = y1 + size.height * 0.06;

    const r = Math.min((x2 - x1) / 2, (y2 - y1) / 2);

    if(prevX2 === x1 && prevY1 !== null && prevY1 !== y1) {
      if(prevY1 > y1) {
        path.push(`M${x1-t},${y2} L${x1+t},${y2} L${x1+t},${prevY1} L${x1-t},${prevY1} Z`);
      } else if(prevY1 < y1) {
        path.push(`M${x1-t},${prevY2} L${x1+t},${prevY2} L${x1+t},${y1} L${x1-t},${y1} Z`);
      }
    }

    // First half
    if(prevX2 !== x1 || prevY1 === null) {
      path.push(`M${(x1+x2)/2},${y2} L${x1-tl+r},${y2} C${x1-tl+r*0.25},${y2} ${x1-tl},${y2-r*0.25} ${x1-tl},${y2-r} L${x1-tl},${y1+r} C${x1-tl},${y1+r*0.25} ${x1-tl+r*0.25},${y1} ${x1-tl+r},${y1} L${(x1+x2)/2},${y1}`);
    } else if(prevY1 > y1) {
      path.push(`M${(x1+x2)/2},${y2} L${x1-tl},${y2} L${x1-tl},${y1+r} C${x1-tl},${y1+r*0.25} ${x1-tl+r*0.25},${y1} ${x1-tl+r},${y1} L${(x1+x2)/2},${y1}`);
    } else if(prevY1 < y1) {
      path.push(`M${(x1+x2)/2},${y2} L${x1-tl+r},${y2} C${x1-tl+r*0.25},${y2} ${x1-tl},${y2-r*0.25} ${x1-tl},${y2-r} L${x1-tl},${y1} L${(x1+x2)/2},${y1}`);
    } else {
      path.push(`M${(x1+x2)/2},${y2} L${x1-tl},${y2} L${x1-tl},${y1} L${(x1+x2)/2},${y1}`);
    }

    // Second half
    if(nextY1 === null || nextX1 !== x2) {
      path.push(`L${x2+tr-r},${y1} C${x2+tr-r*0.25},${y1} ${x2+tr},${y1+r*0.25} ${x2+tr},${y1+r} L${x2+tr},${y2-r} C${x2+tr},${y2-r*0.25} ${x2+tr-r*0.25},${y2} ${x2+tr-r},${y2} Z`);
    } else if(nextY1 > y1) {
      path.push(`L${x2+tr-r},${y1} C${x2+tr-r*0.25},${y1} ${x2+tr},${y1+r*0.25} ${x2+tr},${y1+r} L${x2+tr},${y2} Z`);
    } else if(nextY1 < y1) {
      path.push(`L${x2+tr},${y1} L${x2+tr},${y2-r} C${x2+tr},${y2-r*0.25} ${x2+tr-r*0.25},${y2} ${x2+tr-r},${y2} Z`);
    } else {
      path.push(`L${x2+tr},${y1} L${x2+tr},${y2} Z`);
    }

    prevY1 = y1;
    prevY2 = y2;
    prevX2 = x2;
  }

  serie.shortData.forEach(dataPoint => {
    const t1 = dayjs(dataPoint.dateTime).diff(xAxisTimeStart.value, 'seconds');
    const t2 = t1 + dataPoint.seconds;

    const x1 = (t1 / xAxisTimeSeconds.value) * size.width;
    const x2 = (t2 / xAxisTimeSeconds.value) * size.width;

    const y1 = getSleepY(dataPoint.level);
    const y2 = y1 + size.height * 0.05;

    const r = Math.min((x2 - x1) / 2, (y2 - y1) / 2);

    path.push(`M${(x1+x2)/2},${y2} L${x1-t+r},${y2} C${x1-t+r*0.25},${y2} ${x1-t},${y2-r*0.25} ${x1-t},${y2-r} L${x1-t},${y1+r} C${x1-t},${y1+r*0.25} ${x1-t+r*0.25},${y1} ${x1-t+r},${y1} L${(x1+x2)/2},${y1}`);
    path.push(`L${x2+t-r},${y1} C${x2+t-r*0.25},${y1} ${x2+t},${y1+r*0.25} ${x2+t},${y1+r} L${x2+t},${y2-r} C${x2+t},${y2-r*0.25} ${x2+t-r*0.25},${y2} ${x2+t-r},${y2} Z`);
  });

  return path.join(' ');
}
</script>

<template>
  <vgr-stack class="aspect-[2/1] w-full" gap="small">
    <vgr-stack v-if="legend" horizontal class="w-full pb-2 flex-wrap gap-y-1" :class="legend.class || null" :align="legend.align || null">
      <div v-for="(serie, index) in series" :key="index" class="flex items-center gap-2 text-sm">
        <template v-if="serie.type === 'line'">
          <span v-if="serie.detail === 'square'" class="block size-[7.5px]" :class="[colors[serie.color].bg]"></span>
          <svg v-else-if="serie.detail === 'triangle'" viewBox="0 0 10 9" width="10" height="9">
            <path d="M5,0 L10,9 0,9 Z" class="stroke-none" :class="[colors[serie.color].fill]"/>
          </svg>
          <span v-else class="block size-2 rounded-full" :class="[colors[serie.color].bg]"/>
        </template>
        <span v-else class="block size-2 rounded-[2px]" :class="[colors[serie.color].bg]"/>
        <span>{{ serie.name }}</span>
      </div>
    </vgr-stack>

    <div class="flex-1 flex w-full pt-2" :class="{'pb-2': !xAxis}">
      <div v-if="leftAxi?.length" class="flex gap-3" :class="{'pb-5': xAxis}">
        <template v-for="(axis, index) in leftAxi" :key="index">
          <div class="border-r border-neutral-80 text-2xs text-neutral-60 flex flex-col" :class="axis.class || null">
            <template v-if="axis.steps">
              <div class="flex flex-col-reverse justify-between items-end leading-4 -my-2 flex-1 pr-1">
                <div v-for="(step, si) in axis.steps" :key="si">{{ step }}</div>
              </div>
            </template>
            <template v-else-if="axis.min && axis.max">
              <div class="flex flex-col justify-between items-end leading-4 -my-2 flex-1 pr-1">
                <div>{{ formatString(axis.format ?? '{0:N0}', axis.max) }}</div>
                <div>{{ formatString(axis.format ?? '{0:N0}', axis.min) }}</div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1 border-b border-neutral-80 relative">
          <div ref="graphWrapper" class="absolute inset-0">
            <svg v-if="size.width > 0" class="w-full h-auto -my-1" :viewBox="`0 -4 ${size.width} ${size.height + 8}`" preserveAspectRatio="none">
              <template v-for="(serie, index) in series" :key="index">
                <!-- Line -->
                <template v-if="serie.type === 'line'">
                  <path :d="linePath(serie)" class="fill-none stroke-2" :class="[colors[serie.color].stroke]"/>
                  <template v-if="serie.detail !== 'none'">
                    <template v-for="(dp, j) in serie.data" :key="j">
                      <template v-if="dp !== null">x
                        <path v-if="serie.detail === 'square'" :d="'M' + (j * sectionSize + sectionSize / 2 - 3.8) + ',' + (getY(dp, ...minMax(serie)) - 3.8) + ' l 7.6,0 0,7.6 -7.6,0 Z'" class="stroke-none" :class="[colors[serie.color].fill]"/>
                        <path v-else-if="serie.detail === 'triangle'" :d="'M' + (j * sectionSize + sectionSize / 2) + ',' + (getY(dp, ...minMax(serie)) - 5) + ' l 5,9 -10,0 Z'" class="stroke-none" :class="[colors[serie.color].fill]"/>
                        <circle v-else :cx="j * sectionSize + sectionSize / 2" :cy="getY(dp, ...minMax(serie))" :r="4" class="stroke-none" :class="[colors[serie.color].fill]"/>
                      </template>
                    </template>
                  </template>
                </template>
                <!-- Bar -->
                <template v-if="serie.type === 'bar'">
                  <path :d="barPath(serie)" class="stroke-none" :class="[colors[serie.color].fill]"/>
                </template>
                <!-- Sleep -->
                <template v-if="serie.type === 'sleep'">
                  <!--<path v-for="(dp, i) in serie.shortData" :key="i" :d="sleepSegment(dp)" class="stroke-none" :class="[sleepFill(dp.level)]"/>
                  <path v-for="(dp, i) in serie.data" :key="i" :d="sleepSegment(dp)" class="stroke-none" :class="[sleepFill(dp.level)]"/>-->
                  <defs>
                    <linearGradient :id="serie.id + '-fill'" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="2.5%" stop-color="currentColor" class="text-pink-60"/>
                      <stop offset="27.5%" stop-color="currentColor" class="text-cyan-80"/>
                      <stop offset="52.5%" stop-color="currentColor" class="text-cyan-60"/>
                      <stop offset="77.5%" stop-color="currentColor" class="text-cyan-30"/>
                      <stop offset="100%" stop-color="currentColor" class="text-base"/>
                    </linearGradient>
                  </defs>
                  <path :d="sleepPath(serie)" :style="{fill: 'url(#' + serie.id + '-fill)'}"/>
                </template>
              </template>
            </svg>
          </div>
        </div>
        <!-- X Axis -->
        <template v-if="xAxis">
          <div v-if="xAxis.type === 'time'" class="relative h-5 text-xs text-neutral-60" :class="xAxis.class || null">
            <template v-for="(label, index) in sleepLabels()" :key="index">
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
          <div class="border-l border-neutral-80 text-2xs text-neutral-60 flex flex-col" :class="axis.class || null">
            <div class="flex flex-col justify-between items-start leading-4 -my-2 flex-1 pl-1">
              <div>{{ formatString(axis.format ?? '{0:N0}', axis.max) }}</div>
              <div>{{ formatString(axis.format ?? '{0:N0}', axis.min) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <slot/>
  </vgr-stack>
</template>