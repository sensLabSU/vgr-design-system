<script setup lang="ts">

</script>

<template>
  <ul class="flex items-center gap-2 text-xs font-light
    [&>*:not(:first-child)]:before:content-['/'] [&>*:not(:first-child)]:before:pr-2 [&>*:not(:first-child)]:before:opacity-50
    [&>a]:text-healthcare hover:[&>a]:underline
  ">
    <slot/>
  </ul>
</template>