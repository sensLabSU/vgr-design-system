<script lang="ts">
import {Component, h, PropType} from "vue";

export default {
  props: {
    start: String,
    end: String,
    data: Array as PropType<{level:'wake'|'light'|'deep'|'rem', seconds:number, dateTime:string}[]>,
    shortData: Array as PropType<{level:'wake'|'light'|'deep'|'rem', seconds:number, dateTime:string}[]>,
  },
  data() {
    return {
      values: this.data,
      shortValues: this.shortData,
      id: 'vgr-graph-sleep-' + Math.round(Math.random() * 1000000),
    };
  },
  inject: ['chart'],
  created() {
    if(!this.chart) throw new Error('Component VgrGraphSleep must be used inside VgrChart!');

    this.chart.addGraph(this);
  },
  beforeUnmount() {
    this.chart.removeGraph(this);
  },
  computed: {
    paths(): Component {
      return h('g', [
        h('defs', [
          h('linearGradient', {id:`${this.id}-fill`, x1:"0%", y1:"0%", x2:"0%", y2:"100%"}, [
            h('stop', { offset: '2.5%', 'stop-color': 'currentColor', class: 'text-pink-60' }),
            h('stop', { offset: '27.5%', 'stop-color': 'currentColor', class: 'text-blue-90' }),
            h('stop', { offset: '52.5%', 'stop-color': 'currentColor', class: 'text-blue-70' }),
            h('stop', { offset: '77.5%', 'stop-color': 'currentColor', class: 'text-blue-50' }),
            h('stop', { offset: '100%', 'stop-color': 'currentColor', class: 'text-base' }),
          ]),
        ]),
        h('path', { d: this.sleepPath(), style: `fill: url(#${this.id}-fill)` }),
      ]);
    },
  },
  methods: {
    getSleepY(level) {
      const h = this.chart.getHeight();
      const o = h * 0.015;
      switch(level) {
        case 'wake': return 0 - o;
        case 'rem': return 0.25 * h - o;
        case 'light': return 0.5 * h - o;
        case 'deep': return 0.75 * h - o;
      }
    },
    sleepPath() {
      let prevY1 = null;
      let prevY2 = null;
      let prevX2 = null;

      const chartWidth = this.chart.getWidth();
      const chartHeight = this.chart.getHeight();
      const startTime = this.chart.getXAxisStartTime();
      const timeSeconds = this.chart.getXAxisTimeSeconds();
      const n = this.values.length;
      const path = [];
      const t = 0.5;

      for(let i = 0; i < n; i++) {
        const tl = i === 0 ? 0 : t;
        const tr = i === (n-1) ? 0 : t;

        const dataPoint = this.values[i];

        const x1 = this.chart.getX(i, dataPoint);
        const x2 = this.chart.getX(i, {dateTime: (new Date(+new Date(dataPoint.dateTime) + dataPoint.seconds * 1000)).toISOString()});

        const nextX1 = i === (n-1) ? null : this.chart.getX(i, this.values[i + 1]);
        const nextY1 = i === (n-1) ? null : this.getSleepY(this.values[i + 1].level);
        const y1 = this.getSleepY(dataPoint.level);
        const y2 = y1 + chartHeight * 0.06;

        const r = Math.min((x2 - x1) / 2, (y2 - y1) / 2);

        if(prevX2 === x1 && prevY1 !== null && prevY1 !== y1) {
          if(prevY1 > y1) {
            path.push(`M${x1-t},${y2} L${x1+t},${y2} L${x1+t},${prevY1} L${x1-t},${prevY1} Z`);
          } else if(prevY1 < y1) {
            path.push(`M${x1-t},${prevY2} L${x1+t},${prevY2} L${x1+t},${y1} L${x1-t},${y1} Z`);
          }
        }

        // First half
        if(prevX2 !== x1 || prevY1 === null) {
          path.push(`M${(x1+x2)/2},${y2} L${x1-tl+r},${y2} C${x1-tl+r*0.25},${y2} ${x1-tl},${y2-r*0.25} ${x1-tl},${y2-r} L${x1-tl},${y1+r} C${x1-tl},${y1+r*0.25} ${x1-tl+r*0.25},${y1} ${x1-tl+r},${y1} L${(x1+x2)/2},${y1}`);
        } else if(prevY1 > y1) {
          path.push(`M${(x1+x2)/2},${y2} L${x1-tl},${y2} L${x1-tl},${y1+r} C${x1-tl},${y1+r*0.25} ${x1-tl+r*0.25},${y1} ${x1-tl+r},${y1} L${(x1+x2)/2},${y1}`);
        } else if(prevY1 < y1) {
          path.push(`M${(x1+x2)/2},${y2} L${x1-tl+r},${y2} C${x1-tl+r*0.25},${y2} ${x1-tl},${y2-r*0.25} ${x1-tl},${y2-r} L${x1-tl},${y1} L${(x1+x2)/2},${y1}`);
        } else {
          path.push(`M${(x1+x2)/2},${y2} L${x1-tl},${y2} L${x1-tl},${y1} L${(x1+x2)/2},${y1}`);
        }

        // Second half
        if(nextY1 === null || nextX1 !== x2) {
          path.push(`L${x2+tr-r},${y1} C${x2+tr-r*0.25},${y1} ${x2+tr},${y1+r*0.25} ${x2+tr},${y1+r} L${x2+tr},${y2-r} C${x2+tr},${y2-r*0.25} ${x2+tr-r*0.25},${y2} ${x2+tr-r},${y2} Z`);
        } else if(nextY1 > y1) {
          path.push(`L${x2+tr-r},${y1} C${x2+tr-r*0.25},${y1} ${x2+tr},${y1+r*0.25} ${x2+tr},${y1+r} L${x2+tr},${y2} Z`);
        } else if(nextY1 < y1) {
          path.push(`L${x2+tr},${y1} L${x2+tr},${y2-r} C${x2+tr},${y2-r*0.25} ${x2+tr-r*0.25},${y2} ${x2+tr-r},${y2} Z`);
        } else {
          path.push(`L${x2+tr},${y1} L${x2+tr},${y2} Z`);
        }

        prevY1 = y1;
        prevY2 = y2;
        prevX2 = x2;
      }

      if(this.shortValues?.length) {
        this.shortValues.forEach(dataPoint => {
          const t1 = (new Date(dataPoint.dateTime) - new Date(startTime)) / 1000;
          const t2 = t1 + dataPoint.seconds;

          const x1 = (t1 / timeSeconds) * chartWidth;
          const x2 = (t2 / timeSeconds) * chartWidth;

          const y1 = this.getSleepY(dataPoint.level);
          const y2 = y1 + chartHeight * 0.05;

          const r = Math.min((x2 - x1) / 2, (y2 - y1) / 2);

          path.push(`M${(x1+x2)/2},${y2} L${x1-t+r},${y2} C${x1-t+r*0.25},${y2} ${x1-t},${y2-r*0.25} ${x1-t},${y2-r} L${x1-t},${y1+r} C${x1-t},${y1+r*0.25} ${x1-t+r*0.25},${y1} ${x1-t+r},${y1} L${(x1+x2)/2},${y1}`);
          path.push(`L${x2+t-r},${y1} C${x2+t-r*0.25},${y1} ${x2+t},${y1+r*0.25} ${x2+t},${y1+r} L${x2+t},${y2-r} C${x2+t},${y2-r*0.25} ${x2+t-r*0.25},${y2} ${x2+t-r},${y2} Z`);
        });
      }

      return path.join(' ');
    },
  },
  render() {},
}
</script>