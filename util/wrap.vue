<script>
import {h} from "vue";

export default {
  name: 'wrap',
  props: {
    is: [Object, Boolean, null],
  },
  render() {
    return this.is ? h(this.is, this.$attrs, () => this.$slots.default()) : this.$slots.default();
  }
}
</script>