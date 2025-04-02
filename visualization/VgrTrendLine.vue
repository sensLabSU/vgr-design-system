<script lang="ts">
import type {PropType} from "vue";
import {h} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    dataPoints: Array as PropType<(number|null)[]>,
    axis: String,
    color: String,
    dashed: Boolean,
    thickness: Number as PropType<0.25|0.5|1|2>,
    from: Number,
    to: Number,
  },
  data() {
    return {
      values: this.data,
      id: 'vgr-trend-line-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrTrendLine must be used inside VgrChart!');

    (this.chart as typeof VgrChart).addGraph(this);
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeGraph(this);
  },
  computed: {
    paths() {
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
      // Calculate trend line using linear regression
      const xValues = [];
      const yValues = [];
      const trendStart = this.from ?? 0;
      const trendTo = this.to ?? this.dataPoints!.length;
      let count = 0;

      for (let i = trendStart; i < trendTo; i++)
      {
        const dp = this.dataPoints![i];
        if(dp) {
          xValues.push(i + 1);
          yValues.push(dp);
          count++;
        }
      }

      const xSum = xValues.reduce((acc, x) => acc + x, 0);
      const ySum = yValues.reduce((acc, x) => acc + x, 0);
      let xxSum = 0;
      let xySum = 0;
      for (let i = 0; i < count; i++)
      {
        xySum += (xValues[i]*yValues[i]);
        xxSum += (xValues[i]*xValues[i]);
      }

      let slope = ((count*xySum) - (xSum*ySum))/((count*xxSum) - (xSum*xSum));
      if(slope === Infinity) slope = 0;

      const intercept = (ySum - (slope*xSum))/count;

      const start = (slope*xValues[0]) + intercept;
      const end = (slope*xValues[count - 1]) + intercept;

      const numSections = (this.chart as typeof VgrChart).getNumSections();
      const sectionSize = (this.chart as typeof VgrChart).getSectionSize();
      const width = (this.chart as typeof VgrChart).getWidth();
      const x1 = ((xValues[0] - 1) / numSections) * width + (sectionSize * 0.5);
      const x2 = ((xValues[count - 1] - 1) / numSections) * width + (sectionSize * 0.5);

      const axis = (this.chart as typeof VgrChart).getAxis(this.axis);
      const y1 = (this.chart as typeof VgrChart).getY(start, axis.min, axis.max);
      const y2 = (this.chart as typeof VgrChart).getY(end, axis.min, axis.max);

      return `M${x1},${y1} L${x2},${y2}`;
    },
    renderLine() {
      const color = (this.chart as typeof VgrChart).getColor(this.color);

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