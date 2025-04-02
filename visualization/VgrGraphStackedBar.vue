<script lang="ts">
import {h} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    x: Number,
    axis: String,
    segments: Array,
  },
  data() {
    return {
      values: [0],
      segmentValues: this.segments,
      id: 'vgr-graph-stacked-bar-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrGraphStackedBar must be used inside VgrChart!');

    (this.chart as typeof VgrChart).addGraph(this);
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeGraph(this);
  },
  computed: {
    paths() {
      return this.renderStack();
    },
  },
  methods: {
    renderStack() {
      const axis = (this.chart as typeof VgrChart).getAxis(this.axis);
      const sectionSize = (this.chart as typeof VgrChart).getSectionSize();
      const x = (this.chart as typeof VgrChart).getX(this.x, 0);
      const barWidth = Math.min(sectionSize * 0.2, 32);
      const x1 = x - barWidth * 0.5;
      const x2 = x1 + barWidth;

      const children: any[] = [];

      this.segmentValues!.forEach((segment: any) => {
        const y1 = (this.chart as typeof VgrChart).getY(segment.y1, axis.min, axis.max)-0.25;
        const y2 = (this.chart as typeof VgrChart).getY(segment.y2, axis.min, axis.max)+0.25;
        const color = (this.chart as typeof VgrChart).getColor(segment.color);

        children.push(h('path', {
          d: `M${x1},${y1} L${x2},${y1} L${x2},${y2} L${x1},${y2} Z`,
          class: 'stroke-none ' + color.fill,
        }));
      });

      return h('g', children);
    },
  },
  render() { },
}
</script>