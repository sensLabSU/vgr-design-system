<script lang="ts">
import {h, PropType} from "vue";

export default {
  props: {
    name: String,
    type: String as PropType<'line'|'bar'>,
    data: Array as PropType<number[]>,
    format: String,
    axis: String,
    color: String as PropType<'blue'|'red'|'green'|'yellow'|'purple'|'black'>,
    smooth: Boolean,
    detail: String as PropType<'none'|'circle'|'square'|'triangle'>,
  },
  data: () => ({
    id: 'vgr-graph-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrGraph must be used inside VgrChart!');

    this.chart.addGraph({id: this.id, ...this.$props});
  },
  beforeUnmount() {
    this.chart.removeGraph(this.id);
  },
  render() {
    return null;
  },
}
</script>