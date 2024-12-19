<script lang="ts">
import {h, PropType} from "vue";
import {Color} from "../types";

export default {
  props: {
    name: String,
    type: String as PropType<'line'|'bar'>,
    data: Array as PropType<number[]>,
    format: String,
    axis: String,
    color: String,
    smooth: Boolean,
    detail: String as PropType<'none'|'circle'|'square'|'triangle'>,
  },
  data() {
    return {
      values: this.data,
      id: 'vgr-graph-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrGraph must be used inside VgrChart!');

    this.chart.addGraph(this);
  },
  beforeUnmount() {
    this.chart.removeGraph(this);
  },
  computed: {
    paths(): string|null {
      switch(this.type) {
        case 'line': return this.renderLineGraph();
        case 'bar': return this.renderBarGraph();
      }
      return null;
    }
  },
  methods: {
    linePath(): string {
      let axis = this.chart.getAxis(this.axis);
      const [min, max] = [axis.min, axis.max];
      const points = [];

      let prevWasData = false;
      let prevX = null;

      for (let i = 0; i < this.values.length; i++) {
        let dp = this.values[i];

        if (dp !== null) {
          const y = this.chart.getY(dp, min, max);
          const x = this.chart.getX(i, this.values[i]);

          if (!prevWasData) {
            points.push(`M ${x} ${y}`);
          } else {
            if(this.smooth) {
              const span = x - prevX;
              const x1 = prevX + span * 0.5;
              const x2 = prevX + span * 0.5;

              const y1 = this.chart.getY(this.values[i - 1], min, max);
              const y2 = y;

              points.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
            } else {
              points.push(`L ${x} ${y}`);
            }
          }

          prevX = x;
        }

        prevWasData = dp !== null;
      }

      return points.join(' ');
    },
    barPath(): string {
      const axis = this.chart.getAxis(this.axis);
      const [min, max] = [axis.min, axis.max];
      const offset = this.chart.getBarOffset(this);
      const sectionSize = this.chart.getSectionSize();
      const barWidth = this.chart.getBarWidth();
      const barRadius = this.chart.getBarRadius();
      const barSectionOffset = this.chart.getBarSectionOffset();
      const barGap = this.chart.getBarGap();
      const paths = [];

      for (let i = 0; i < this.values.length; i++) {
        const y1 = this.chart.getY(Math.max(Math.max(0, min), this.values[i]), min, max);
        const y2 = this.chart.getY(Math.min(Math.max(0, min), this.values[i]), min, max);
        const h = y2 - y1;
        const r = Math.min(barRadius, h * 0.5, barWidth * 0.5);

        const x = this.chart.getX(i, this.values[i]);
        const x1 = x - barSectionOffset + (offset > 0 ? barGap * offset : 0) + (barWidth * offset);
        const x2 = x1 + barWidth;

        if(this.values[i] > 0) {
          paths.push(`M${x1},${y1 + r} C${x1} ${y1}, ${x1} ${y1}, ${x1 + r} ${y1} L${x2 - r},${y1} C${x2} ${y1}, ${x2} ${y1}, ${x2} ${y1 + r} L${x2},${y2} L${x1},${y2} Z`);
        } else {
          paths.push(`M${x1},${y1} L${x2},${y1} L${x2},${y2 - r} C${x2} ${y2},${x2} ${y2},${x2-r} ${y2} L${x1 + r} ${y2} C${x1} ${y2},${x1} ${y2},${x1} ${y2-r} Z`);
        }
      }

      return paths.join(' ');
    },
    renderLineGraph() {
      const color = this.chart.getColor(this.color);

      const children = [
        h('path', {d: this.linePath(), class: 'fill-none stroke-2 ' + color.stroke}),
      ];

      if(this.detail !== 'none') {
        const sectionSize = this.chart.getSectionSize();
        let axis = this.chart.getAxis(this.axis);
        const [min, max] = [axis.min, axis.max];

        this.values.forEach((dp: number, j) => {
          if(dp === null) return;

          const x = this.chart.getX(j, dp);

          if(this.detail === 'square') {
            const d = 'M' + (x - 3.8) + ',' + (this.chart.getY(dp, min, max) - 3.8) + ' l 7.6,0 0,7.6 -7.6,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else if(this.detail === 'triangle') {
            const d = 'M' + x + ',' + (this.chart.getY(dp, min, max) - 5) + ' l 5,9 -10,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else {
            children.push(h('circle', {
              cx: x,
              cy: this.chart.getY(dp, min, max),
              r: 4,
              class: 'stroke-none ' + color.fill,
            }));
          }
        });
      }

      return h('g', children);
    },
    renderBarGraph() {
      const color = this.chart.getColor(this.color);

      return h('path', {d: this.barPath(), class: 'stroke-none ' + color.fill});
    },
  },
  render() { },
}
</script>