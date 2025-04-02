<script lang="ts">
import type {PropType} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    align: String as PropType<null | 'default' | 'left' | 'start' | 'center' | 'middle' | 'right' | 'end'>,
    class: String,
    bottom: Boolean,
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrLegend must be used inside VgrChart!');

    (this.chart as typeof VgrChart).addLegend({...this.$props});
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeLegend(null);
  },
  render() {
    return null;
  },
}
</script>