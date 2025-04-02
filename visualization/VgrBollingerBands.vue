<script lang="ts">
import type {PropType} from "vue";
import {h} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    dataPoints: Array as PropType<(number|null)[]>,
    period: Number,
    factor: Number,
    axis: String,
    strokeColor: String,
    fillColor: String,
    dashed: Boolean,
    thickness: Number as PropType<0.25|0.5|1|2>,
    legendText: String,
  },
  data() {
    return {
      values: this.data,
      id: 'vgr-bollinger-bands-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrBollingerBands must be used inside VgrChart!');

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
    linePath() {
      const count = this.dataPoints!.length || 0;
      const period = this.period || 10;
      const factor = this.factor || 1.5;
      const bollinger = [];

      let total_average = 0;
      let total_squares = 0;

      for (let i = 0; i < count; i++) {
        total_average += this.dataPoints![i] ?? 0;
        total_squares += Math.pow(this.dataPoints![i] ?? 0, 2);

        if (i >= period - 1) {
          const average = total_average / period;
          const stdev = Math.sqrt((total_squares - Math.pow(total_average,2)/period) / period);

          bollinger.push({
            average,
            top: average + factor * stdev,
            bottom: average - factor * stdev,
          });

          total_average -= this.dataPoints![i - period + 1] ?? 0;
          total_squares -= Math.pow(this.dataPoints![i - period + 1] ?? 0, 2);
        }
        else {
          bollinger.push(null);
        }
      }

      const axis = (this.chart as typeof VgrChart).getAxis(this.axis);
      const sectionSize = (this.chart as typeof VgrChart).getSectionSize();
      const topLine = [];
      const centerLine = [];
      const bottomLine = [];
      for (let i = 0; i < count; i++) {
        if(!bollinger[i]) continue;

        const x = i * sectionSize + sectionSize * 0.5;
        const yt = (this.chart as typeof VgrChart).getY(bollinger[i]!.top, axis.min, axis.max);
        const yc = (this.chart as typeof VgrChart).getY(bollinger[i]!.average, axis.min, axis.max);
        const yb = (this.chart as typeof VgrChart).getY(bollinger[i]!.bottom, axis.min, axis.max);

        topLine.push(`${x},${yt}`);
        centerLine.push(`${x},${yc}`);
        bottomLine.push(`${x},${yb}`);
      }

      bottomLine.reverse();

      return {
        outline: 'M' + topLine.join(' L') + ' M' + centerLine.join(' L') + ' M' + bottomLine.join(' L'),
        fill: 'M' + topLine.join(' L') + ' L' + bottomLine.join(' L') + ' Z',
      };
    },
    renderLine() {
      const strokeColor = (this.chart as typeof VgrChart).getColor(this.strokeColor);
      const fillColor = (this.chart as typeof VgrChart).getColor(this.fillColor);
      const bollinger = this.linePath();

      return h('g', [
        this.fillColor ? h('path', {
          d: bollinger.fill,
          class: fillColor.fill,
        }) : null,
        this.strokeColor ? h('path', {
          d: bollinger.outline,
          class: 'fill-none ' + this.stroke + ' ' + strokeColor.stroke,
          'stroke-dasharray': this.dashed ? 5 : null,
        }) : null,
      ]);
    },
  },
  render() { },
}
</script>