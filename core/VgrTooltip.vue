<script lang="ts">
import {cloneVNode, h, PropType, Ref, ref, useSlots} from "vue";

export default {
  props: {
    text: String,
    kbd: String,
    position: String as PropType<'default'|'left'|'right'|'top'|'bottom'>,
  },
  setup(props) {
    const slots = useSlots();
    const tooltip = ref();
    const fixed: Ref<boolean> = ref(false);

    function showTooltip(e) {
      const op = e.target.offsetParent;
      fixed.value = ['sticky','fixed'].includes(getComputedStyle(op).position);
      const classes = [
          (fixed ? 'fixed' : 'absolute'), 'm-0 pointer-events-none text-sm leading-tight',
          'bg-base-20 text-white px-3 py-2 rounded-md',
      ];

      tooltip.value.showPopover();

      let left = e.target.offsetLeft;
      let top = e.target.offsetTop;

      switch (props.position) {
        case 'left':
          top += e.target.offsetHeight / 2;
          classes.push('-translate-x-full -translate-y-1/2 mr-1');
          break;
        case 'right':
          top += e.target.offsetHeight / 2;
          left += e.target.offsetWidth;
          classes.push('-translate-y-1/2 ml-1');
          break;
        case 'bottom':
          top += e.target.offsetHeight;
          left += e.target.offsetWidth / 2;
          classes.push('-translate-x-1/2 mt-1');
          break;
        default:
          left += e.target.offsetWidth / 2;
          classes.push('-translate-x-1/2 -translate-y-full mb-1');
          break;
      }

      tooltip.value.className = classes.join(' ');
      tooltip.value.style.top = top + 'px';
      tooltip.value.style.left = left + 'px';
    }
    function hideTooltip() {
      tooltip.value.hidePopover();
    }

    const slotContent = slots.default ? slots.default() : []
    const transformedSlotContent = slotContent.map(vNode => cloneVNode(vNode, {
      onMouseenter: (e) => { showTooltip(e); },
      onMouseleave: (e) => { hideTooltip(e); },
      onMousedown: (e) => { hideTooltip(e); },
    }));

    return () => [
        ...transformedSlotContent,
        h('div', {
          ref: tooltip,
          popover: 'auto',
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