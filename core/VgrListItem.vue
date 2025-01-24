<script setup>

</script>

<template>
  <li class="
    relative flex items-center justify-between py-5 [[data-card]>[data-list]>&]:px-5
    [[data-list]>[data-list-item]+&]:border-t [[data-list]>[data-list-item]+&]:border-neutral-80
  " data-list-item>
    <div class="flex items-center gap-4">
      <slot/>
    </div>

    <div v-if="$slots.col2" class="flex items-center gap-4">
      <slot name="col2"/>
    </div>

    <div v-if="$slots.end" class="flex items-center gap-4">
      <slot name="end"/>
    </div>
  </li>
</template>