<script lang="ts">
import {h, PropType} from "vue";

export default {
  props: {
    start: String,
    end: String,
    data: Array as PropType<{level:'wake'|'light'|'deep'|'rem', seconds:number, dateTime:string}[]>,
    shortData: Array as PropType<{level:'wake'|'light'|'deep'|'rem', seconds:number, dateTime:string}[]>,
  },
  data: () => ({
    id: 'vgr-graph-sleep-' + Math.random() * 1000000,
  }),
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrGraphSleep must be used inside VgrChart!');

    this.chart.addGraph({id: this.id, type: 'sleep', ...this.$props});
  },
  beforeUnmount() {
    this.chart.removeGraph(this.id);
  },
  render() {
    return null;
  },
}
</script>