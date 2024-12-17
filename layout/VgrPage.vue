<script setup lang="ts">

</script>

<template>
  <div class="
    bg-neutral-95 w-full min-h-screen grid grid-cols-[1fr] grid-rows-[1fr]
    has-[.vgr-sidebar]:grid-cols-[auto,1fr]
    has-[.vgr-navbar]:grid-rows-[auto,1fr]
    has-[.vgr-sidebar+.vgr-navbar]:grid has-[.vgr-sidebar+.vgr-navbar]:grid-rows-[auto,1fr] has-[.vgr-sidebar+.vgr-navbar]:grid-cols-[auto,1fr]
    has-[.vgr-navbar+.vgr-sidebar]:grid has-[.vgr-navbar+.vgr-sidebar]:grid-rows-[auto,1fr] has-[.vgr-navbar+.vgr-sidebar]:grid-cols-[auto,1fr]
    [&>.vgr-sidebar]:has-[.vgr-sidebar+.vgr-navbar]:row-span-2
    [&>.vgr-navbar]:has-[.vgr-navbar+.vgr-sidebar]:col-span-2
  ">
    <slot/>
  </div>
</template>