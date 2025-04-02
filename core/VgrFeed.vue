<script setup lang="ts">

</script>

<template>
  <div class="[[data-card]>&]:p-5 flex items-stretch" data-feed>
    <div class="w-7 relative">
      <div class="absolute inset-y-3.5 bg-neutral-80 w-px left-1/2 -translate-x-[0.5px]"></div>
    </div>
    <ul class="-ml-7 relative flex flex-col gap-6 flex-1">
      <slot/>
    </ul>
  </div>
</template>