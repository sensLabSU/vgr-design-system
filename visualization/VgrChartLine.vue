<script lang="ts">
import {h, PropType} from "vue";
import {Color} from "../types";

export default {
  props: {
    y: Number,
    axis: String,
    color: String as PropType<Color>,
    dashed: Boolean,
    thickness: Number as PropType<0.25|0.5|1|2>,
  },
  data() {
    return {
      values: this.data,
      id: 'vgr-chart-line-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrChartLine must be used inside VgrChart!');

    this.chart.addGraph(this);
  },
  beforeUnmount() {
    this.chart.removeGraph(this);
  },
  computed: {
    paths(): string|null {
      return this.renderLine();
    },
    stroke() {
      switch(this.thickness) {
        case 0.25: return 'stroke-[0.25]';
        case 0.5: return 'stroke-[0.5]';
        case 2: return 'stroke-2';
        default: return 'stroke';
      }
    },
  },
  methods: {
    linePath(): string {
      const axis = this.chart.getAxis(this.axis);

      const y = this.chart.getY(this.y, axis.min, axis.max);
      const x1 = 0;
      const x2 = this.chart.getWidth();

      return `M${x1},${y} L${x2},${y}`;
    },
    renderLine() {
      const color = this.chart.getColor(this.color);

      return h('path', {
        d: this.linePath(),
        class: this.stroke + ' ' + color.stroke,
        'stroke-dasharray': this.dashed ? 5 : null,
      });
    },
  },
  render() { },
}
</script>