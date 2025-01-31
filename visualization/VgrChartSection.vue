<script lang="ts">
import {h, PropType} from "vue";
import {Color} from "../types";

export default {
  props: {
    from: Number,
    to: Number,
    axis: String,
    fillColor: String as PropType<Color>,
    strokeColor: String as PropType<Color>,
    dashed: Boolean,
    edgeThickness: Number as PropType<0.25|0.5|1|2>,
    label: String,
  },
  data() {
    return {
      values: this.data,
      id: 'vgr-chart-section-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrChartSection must be used inside VgrChart!');

    this.chart.addGraph(this);
  },
  beforeUnmount() {
    this.chart.removeGraph(this);
  },
  computed: {
    paths(): string|null {
      return this.renderSection();
    },
    stroke() {
      switch(this.edgeThickness) {
        case 0.25: return 'stroke-[0.25]';
        case 0.5: return 'stroke-[0.5]';
        case 2: return 'stroke-2';
        default: return 'stroke';
      }
    },
  },
  methods: {
    fillPath(): string {
      const numSections = this.chart.getNumSections();
      const width = this.chart.getWidth();
      const h = this.chart.getHeight();
      const x1 = (this.from / numSections) * width;
      const x2 = (this.to / numSections) * width;

      return `M${x1},0 L${x1},${h} L${x2},${h} L${x2},0 Z`;
    },
    linePath(): string {
      const numSections = this.chart.getNumSections();
      const width = this.chart.getWidth();
      const h = this.chart.getHeight();
      const x1 = (this.from / numSections) * width;
      const x2 = (this.to / numSections) * width;

      return this.to ? `M${x1},0 L${x1},${h} M${x2},${h} L${x2},0` : `M${x1},0 L${x1},${h}`;
    },
    renderSection() {
      const fillColor = this.chart.getColor(this.fillColor);
      const strokeColor = this.chart.getColor(this.strokeColor);

      return h('g', [
        this.to ? h('path', {
          d: this.fillPath(),
          class: fillColor.fill,
        }) : null,
        this.strokeColor ? h('path', {
          d: this.linePath(),
          class: this.stroke + ' ' + strokeColor.stroke,
          'stroke-dasharray': this.dashed ? 5 : null,
        }) : null,
        this.label ? h('text', {
          x: (this.from / this.chart.getNumSections()) * this.chart.getWidth() + 3,
          y: 12,
          class: 'fill-black text-xs',
        }, [this.label]) : null,
      ]);
    },
  },
  render() { },
}
</script>