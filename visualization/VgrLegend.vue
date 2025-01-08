<script lang="ts">
import {h, PropType} from "vue";

export default {
  props: {
    align: String as PropType<null | 'default' | 'left' | 'start' | 'center' | 'middle' | 'right' | 'end'>,
    class: String,
    bottom: Boolean,
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrLegend must be used inside VgrChart!');

    this.chart.addLegend({...this.$props});
  },
  beforeUnmount() {
    this.chart.removeLegend(null);
  },
  render() {
    return null;
  },
}
</script>