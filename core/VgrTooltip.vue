<script lang="ts">
import type {PropType, Ref} from "vue";
import {cloneVNode, h, ref, useSlots} from "vue";

export default {
  props: {
    text: String,
    kbd: String,
    position: String as PropType<'default'|'left'|'right'|'top'|'bottom'>,
  },
  setup(props) {
    const slots = useSlots();
    const tooltip = ref();

    function showTooltip(e: MouseEvent) {
      const classes = [
        'absolute',
        'z-[1000] m-0 pointer-events-none text-sm leading-tight',
        'bg-base-20 text-white px-3 py-2 rounded-md',
      ];

      let left = (e.target! as HTMLElement).offsetLeft;
      let top = (e.target! as HTMLElement).offsetTop;

      switch (props.position) {
        case 'left':
          top += (e.target! as HTMLElement).offsetHeight / 2;
          classes.push('-translate-x-full -translate-y-1/2 -ml-1');
          break;
        case 'right':
          top += (e.target! as HTMLElement).offsetHeight / 2;
          left += (e.target! as HTMLElement).offsetWidth;
          classes.push('-translate-y-1/2 ml-1');
          break;
        case 'bottom':
          top += (e.target! as HTMLElement).offsetHeight;
          left += (e.target! as HTMLElement).offsetWidth / 2;
          classes.push('-translate-x-1/2 mt-1');
          break;
        default:
          left += (e.target! as HTMLElement).offsetWidth / 2;
          classes.push('-translate-x-1/2 -translate-y-full -mt-1');
          break;
      }

      tooltip.value.className = classes.join(' ');
      tooltip.value.style.top = top + 'px';
      tooltip.value.style.left = left + 'px';
    }

    function hideTooltip() {
      tooltip.value.className = 'hidden';
    }

    const slotContent = slots.default ? slots.default() : []
    const transformedSlotContent = slotContent.map(vNode => cloneVNode(vNode, {
      onMouseenter: (e: MouseEvent) => { showTooltip(e); },
      onMouseleave: (e: MouseEvent) => { hideTooltip(); },
      onMousedown: (e: MouseEvent) => { hideTooltip(); },
    }));

    return () => [
        ...transformedSlotContent,
      h('div', {
        ref: tooltip,
        class: 'hidden',
        'data-tooltip': true,
      }, [
        h('span', {
          class: 'whitespace-pre',
        }, props.text),
        props.kbd ? h('span', {
          class: 'font-mono opacity-60 ml-3',
        }, props.kbd) : null,
      ]),
    ];
  }
}
</script>