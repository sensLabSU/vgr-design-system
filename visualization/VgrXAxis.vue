<script lang="ts">
import type {PropType} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    type: String as PropType<'default' | 'time'>,
    labels: Array as PropType<string[]>,
    start: String,
    end: String,
    class: String,
  },
  data: () => ({
      id: 'vgr-x-axis-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrXAxis must be used inside VgrChart!');

    (this.chart as typeof VgrChart).addXAxis({id: this.id, ...this.$props});
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeXAxis(this.id);
  },
  render() {
    return null;
  },
}
</script>