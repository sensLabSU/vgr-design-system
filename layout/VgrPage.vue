<script setup lang="ts">

</script>

<template>
  <div class="
    bg-neutral-95 dark:bg-neutral-10 dark:!text-white
    w-full min-h-screen grid grid-cols-[1fr] grid-rows-[1fr]
    has-[[data-sidebar]]:grid-cols-[auto,1fr]
    has-[[data-navbar]]:grid-rows-[auto,1fr]
    has-[[data-sidebar]+[data-navbar]]:grid has-[[data-sidebar]+[data-navbar]]:grid-rows-[auto,1fr] has-[[data-sidebar]+[data-navbar]]:grid-cols-[auto,1fr]
    has-[[data-navbar]+[data-sidebar]]:grid has-[[data-navbar]+[data-sidebar]]:grid-rows-[auto,1fr] has-[[data-navbar]+[data-sidebar]]:grid-cols-[auto,1fr]
    [&>[data-sidebar]]:has-[[data-sidebar]+[data-navbar]]:row-span-2
    [&>[data-navbar]]:has-[[data-navbar]+[data-sidebar]]:col-span-2
  " data-page>
    <slot/>
  </div>
</template>