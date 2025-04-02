<script lang="ts">
import type {PropType} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    min: Number,
    max: Number,
    format: String,
    right: Boolean,
    identifier: String,
    class: String,
    steps: Array as PropType<string[]>,
    label: String,
    ticks: Number,
  },
  data: () => ({
      id: 'vgr-y-axis-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrYAxis must be used inside VgrChart!');

    (this.chart as typeof VgrChart).addYAxis({id: this.id, ...this.$props});
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeYAxis(this.id);
  },
  render() {
    return null;
  },
}
</script>