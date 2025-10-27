<script setup lang="ts">

</script>

<template>
  <ul class="flex items-center gap-2 text-xs font-light text-black dark:text-white
    [&>*:not(:first-child)]:before:content-['/'] [&>*:not(:first-child)]:before:text-black dark:[&>*:not(:first-child)]:before:text-white
    [&>*:not(:first-child)]:before:pr-2 [&>*:not(:first-child)]:before:opacity-50
    [&>a]:text-healthcare dark:[&>a]:text-healthcare-70 hover:[&>a]:text-healthcare-70 dark:hover:[&>a]:text-healthcare-60
  ">
    <slot/>
  </ul>
</template>