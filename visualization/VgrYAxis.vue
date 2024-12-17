<script lang="ts">
import {h, PropType} from "vue";

export default {
  props: {
    min: Number,
    max: Number,
    format: String,
    right: Boolean,
    identifier: String,
    class: String,
    steps: Array as PropType<string[]>,
  },
  data: () => ({
      id: 'vgr-y-axis-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrYAxis must be used inside VgrChart!');

    this.chart.addYAxis({id: this.id, ...this.$props});
  },
  beforeUnmount() {
    this.chart.removeYAxis(this.id);
  },
  render() {
    return null;
  },
}
</script>