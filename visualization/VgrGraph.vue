<script lang="ts">
import type {PropType} from "vue";
import {h} from "vue";
import {VgrChart} from "./index";

export default {
  props: {
    name: String as PropType<string>,
    type: String as PropType<'line'|'bar'|'dots'|'donut'|'pie'|'span'>,
    data: {} as PropType<any|any[]>,
    format: String,
    axis: String,
    color: String,
    smooth: Boolean,
    detail: String as PropType<'none'|'circle'|'square'|'triangle'>,
    donutThickness: {
      type: Number,
      default: 0.15,
    },
    extrude: Boolean,
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

    (this.chart as typeof VgrChart).addGraph(this);
  },
  beforeUnmount() {
    (this.chart as typeof VgrChart).removeGraph(this);
  },
  computed: {
    paths() {
      switch(this.type) {
        case 'line': return this.renderLineGraph();
        case 'dots': return this.renderDotsGraph();
        case 'bar': return this.renderBarGraph();
        case 'span': return this.renderSpanGraph();
        case 'donut': return this.renderDonutSegment();
        case 'pie': return this.renderPieSegment();
      }
      return null;
    },
  },
  methods: {
    linePath(): string {
      let axis = ((this as any).chart as typeof VgrChart).getAxis((this as any).axis);
      const [min, max] = [axis.min, axis.max];
      const points = [];

      let prevWasData = false;
      let prevX = null;

      for (let i = 0; i < (this as any).values.length; i++) {
        let dp = (this as any).values[i];

        if (dp !== null) {
          const y = ((this as any).chart as typeof VgrChart).getY(dp, min, max);
          const x = ((this as any).chart as typeof VgrChart).getX(i, (this as any).values[i]);

          if (!prevWasData) {
            points.push(`M ${x} ${y}`);
          } else {
            if((this as any).smooth) {
              const span = x - prevX;
              const x1 = prevX + span * 0.5;
              const x2 = prevX + span * 0.5;

              const y1 = ((this as any).chart as typeof VgrChart).getY((this as any).values[i - 1], min, max);
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
    spanPath(): string {
      const axis = ((this as any).chart as typeof VgrChart).getAxis((this as any).axis);
      const [min, max] = [axis.min, axis.max];
      const offset = ((this as any).chart as typeof VgrChart).getBarOffset((this as any));
      const sectionSize = ((this as any).chart as typeof VgrChart).getSectionSize();
      const paths: string[] = [];

      for (let i = 0; i < (this as any).values.length; i++) {
        if(!(this as any).values[i]?.length) continue;

        const x = ((this as any).chart as typeof VgrChart).getX(i, (this as any).values[i]);
        const x1 = x  -sectionSize * 0.25;
        const x2 = x1 + sectionSize * 0.5;

        (this as any).values[i].forEach((span: any) => {
          const y1 = ((this as any).chart as typeof VgrChart).getY(span.from, min, max);
          const y2 = ((this as any).chart as typeof VgrChart).getY(span.to, min, max);
          const h = y2 - y1;

          paths.push(`M${x1},${y1} L${x2},${y1} L${x2},${y2} L${x1},${y2} Z`);
        });
      }

      return paths.join(' ');
    },
    barPath(): string {
      const axis = ((this as any).chart as typeof VgrChart).getAxis((this as any).axis);
      const [min, max] = [axis.min, axis.max];
      const offset = ((this as any).chart as typeof VgrChart).getBarOffset((this as any));
      const sectionSize = ((this as any).chart as typeof VgrChart).getSectionSize();
      const barWidth = ((this as any).chart as typeof VgrChart).getBarWidth();
      const barRadius = ((this as any).chart as typeof VgrChart).getBarRadius();
      const barSectionOffset = ((this as any).chart as typeof VgrChart).getBarSectionOffset();
      const barGap = ((this as any).chart as typeof VgrChart).getBarGap();
      const paths = [];

      for (let i = 0; i < (this as any).values.length; i++) {
        if(!(this as any).values[i]) continue;

        const y1 = ((this as any).chart as typeof VgrChart).getY(Math.max(Math.max(0, min), (this as any).values[i]), min, max);
        const y2 = ((this as any).chart as typeof VgrChart).getY(Math.min(Math.max(0, min), (this as any).values[i]), min, max);
        const h = y2 - y1;
        const r = Math.min(barRadius, h * 0.5, barWidth * 0.5);

        const x = ((this as any).chart as typeof VgrChart).getX(i, (this as any).values[i]);
        const x1 = x - barSectionOffset + (offset > 0 ? barGap * offset : 0) + (barWidth * offset);
        const x2 = x1 + barWidth;

        if((this as any).values[i] > 0) {
          paths.push(`M${x1},${y1 + r} C${x1} ${y1}, ${x1} ${y1}, ${x1 + r} ${y1} L${x2 - r},${y1} C${x2} ${y1}, ${x2} ${y1}, ${x2} ${y1 + r} L${x2},${y2} L${x1},${y2} Z`);
        } else {
          paths.push(`M${x1},${y1} L${x2},${y1} L${x2},${y2 - r} C${x2} ${y2},${x2} ${y2},${x2-r} ${y2} L${x1 + r} ${y2} C${x1} ${y2},${x1} ${y2},${x1} ${y2-r} Z`);
        }
      }

      return paths.join(' ');
    },
    donutPath(): string {
      const offset = ((this as any).chart as typeof VgrChart).getCircularOffset((this as any));
      const total = ((this as any).chart as typeof VgrChart).getCircularTotal();
      const p = (this as any).values / total;
      let [x, y] = ((this as any).chart as typeof VgrChart).getCenter();
      const or = ((this as any).chart as typeof VgrChart).getCircularRadius();
      const ir = or - (or * (this as any).donutThickness);

      const sa = (Math.PI / 2) + (Math.PI * 2) * offset;
      const ha = sa + (Math.PI * 2) * p * 0.5;
      const ea = sa + (Math.PI * 2) * p;


      if(this.extrude) {
        x -= Math.cos(ha) * or * 0.2;
        y -= Math.sin(ha) * or * 0.2;
      }

      const commands = [];
      commands.push(`M ${x - Math.cos(sa) * or} ${y - Math.sin(sa) * or}`);
      commands.push(`A ${or} ${or} 0 0 1 ${x - Math.cos(ha) * or} ${y - Math.sin(ha) * or}`);
      commands.push(`A ${or} ${or} 0 0 1 ${x - Math.cos(ea) * or} ${y - Math.sin(ea) * or}`);
      commands.push(`L ${x - Math.cos(ea) * ir} ${y - Math.sin(ea) * ir}`);
      commands.push(`A ${ir} ${ir} 0 0 0 ${x - Math.cos(ha) * ir} ${y - Math.sin(ha) * ir}`);
      commands.push(`A ${ir} ${ir} 0 0 0 ${x - Math.cos(sa) * ir} ${y - Math.sin(sa) * ir}`);
      commands.push(`Z`);

      return commands.join(' ');
    },
    piePath(): string {
      const offset = ((this as any).chart as typeof VgrChart).getCircularOffset((this as any));
      const total = ((this as any).chart as typeof VgrChart).getCircularTotal();
      const p = (this as any).values / total;
      const [x, y] = ((this as any).chart as typeof VgrChart).getCenter();
      const width = ((this as any).chart as typeof VgrChart).getWidth();
      const height = ((this as any).chart as typeof VgrChart).getHeight();
      const or = Math.min(width, height) / 2;

      const sa = (Math.PI / 2) + (Math.PI * 2) * offset;
      const ha = sa + (Math.PI * 2) * p * 0.5;
      const ea = sa + (Math.PI * 2) * p;

      const commands = [];
      commands.push(`M ${x - Math.cos(sa) * or} ${y - Math.sin(sa) * or}`);
      commands.push(`A ${or} ${or} 0 0 1 ${x - Math.cos(ha) * or} ${y - Math.sin(ha) * or}`);
      commands.push(`A ${or} ${or} 0 0 1 ${x - Math.cos(ea) * or} ${y - Math.sin(ea) * or}`);
      commands.push(`L ${x} ${y}`);
      commands.push(`Z`);

      return commands.join(' ');
    },
    renderLineGraph(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      const children = [
        h('path', {d: (this as any).linePath(), class: 'fill-none stroke-2 ' + color.stroke}),
      ];

      if((this as any).detail !== 'none') {
        const sectionSize = ((this as any).chart as typeof VgrChart).getSectionSize();
        let axis = ((this as any).chart as typeof VgrChart).getAxis((this as any).axis);
        const [min, max] = [axis.min, axis.max];

        (this as any).values.forEach((dp: number, j: number) => {
          if(dp === null) return;

          const x = ((this as any).chart as typeof VgrChart).getX(j, dp);

          if((this as any).detail === 'square') {
            const d = 'M' + (x - 3.8) + ',' + (((this as any).chart as typeof VgrChart).getY(dp, min, max) - 3.8) + ' l 7.6,0 0,7.6 -7.6,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else if((this as any).detail === 'triangle') {
            const d = 'M' + x + ',' + (((this as any).chart as typeof VgrChart).getY(dp, min, max) - 5) + ' l 5,9 -10,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else {
            children.push(h('circle', {
              cx: x,
              cy: ((this as any).chart as typeof VgrChart).getY(dp, min, max),
              r: 4,
              class: 'stroke-none ' + color.fill,
            }));
          }
        });
      }

      return h('g', children);
    },
    renderDotsGraph(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      const children: any[] = [];

      if((this as any).detail !== 'none') {
        const sectionSize = ((this as any).chart as typeof VgrChart).getSectionSize();
        let axis = ((this as any).chart as typeof VgrChart).getAxis((this as any).axis);
        const [min, max] = [axis.min, axis.max];

        (this as any).values.forEach((dp: number, j: number) => {
          if(dp === null) return;

          const x = ((this as any).chart as typeof VgrChart).getX(j, dp);

          if((this as any).detail === 'square') {
            const d = 'M' + (x - 3.8) + ',' + (((this as any).chart as typeof VgrChart).getY(dp, min, max) - 3.8) + ' l 7.6,0 0,7.6 -7.6,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else if((this as any).detail === 'triangle') {
            const d = 'M' + x + ',' + (((this as any).chart as typeof VgrChart).getY(dp, min, max) - 5) + ' l 5,9 -10,0 Z';
            children.push(h('path', {d, class:'stroke-none ' + color.fill}));
          } else {
            children.push(h('circle', {
              cx: x,
              cy: ((this as any).chart as typeof VgrChart).getY(dp, min, max),
              r: 4,
              class: 'stroke-none ' + color.fill,
            }));
          }
        });
      }

      return h('g', children);
    },
    renderSpanGraph(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      return h('path', {d: this.spanPath(), class: 'stroke-none ' + color.fill});
    },
    renderBarGraph(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      return h('path', {d: this.barPath(), class: 'stroke-none ' + color.fill});
    },
    renderDonutSegment(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      return h('path', {d: this.donutPath(), class: 'stroke-none ' + color.fill});
    },
    renderPieSegment(): any {
      const color = ((this as any).chart as typeof VgrChart).getColor((this as any).color);

      return h('path', {d: this.piePath(), class: 'stroke-none ' + color.fill});
    },
  },
  render() { },
}
</script>