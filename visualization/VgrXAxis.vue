<script lang="ts">
import {h, PropType} from "vue";

export default {
  props: {
    type: String as PropType<'default' | 'time'>,
    labels: Array as PropType<string[]>,
    class: String,
  },
  data: () => ({
      id: 'vgr-x-axis-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrXAxis must be used inside VgrChart!');

    this.chart.addXAxis({id: this.id, ...this.$props});
  },
  beforeUnmount() {
    this.chart.removeXAxis(this.id);
  },
  render() {
    return null;
  },
}
</script>