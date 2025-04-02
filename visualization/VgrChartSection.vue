<script lang="ts">
import type {PropType} from "vue";
import {h} from "vue";
import {VgrGraph} from "./index";

export default {
  props: {
    from: Number,
    to: Number,
    axis: String,
    fillColor: String,
    strokeColor: String,
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

    (this.chart as typeof VgrGraph).addGraph(this);
  },
  beforeUnmount() {
    (this.chart as typeof VgrGraph).removeGraph(this);
  },
  computed: {
    paths() {
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
      const numSections = (this.chart as typeof VgrGraph).getNumSections();
      const width = (this.chart as typeof VgrGraph).getWidth();
      const h = (this.chart as typeof VgrGraph).getHeight();
      const x1 = (this.from! / numSections) * width;
      const x2 = (this.to! / numSections) * width;

      return `M${x1},0 L${x1},${h} L${x2},${h} L${x2},0 Z`;
    },
    linePath(): string {
      const numSections = (this.chart as typeof VgrGraph).getNumSections();
      const width = (this.chart as typeof VgrGraph).getWidth();
      const h = (this.chart as typeof VgrGraph).getHeight();
      const x1 = (this.from! / numSections) * width;
      const x2 = (this.to! / numSections) * width;

      return this.to ? `M${x1},0 L${x1},${h} M${x2},${h} L${x2},0` : `M${x1},0 L${x1},${h}`;
    },
    renderSection() {
      const fillColor = (this.chart as typeof VgrGraph).getColor(this.fillColor);
      const strokeColor = (this.chart as typeof VgrGraph).getColor(this.strokeColor);

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
      ]);
    },
  },
  render() { },
}
</script>