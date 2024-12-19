<script setup lang="ts">
import {SleepData} from "../types";
import {VgrChart, VgrGraphSleep, VgrXAxis, VgrYAxis} from "../visualization";

defineProps<{
  data: SleepData;
}>();
</script>

<template>
  <vgr-chart>
    <vgr-y-axis :steps="['\u00a0', 'Djup','Lätt','REM','Vaken']" :min="0" :max="4"/>
    <vgr-x-axis type="time"/>
    <slot/>
    <vgr-graph-sleep :start="data.start" :end="data.end" :data="data.data" :short-data="data.shortData"/>
  </vgr-chart>
</template>