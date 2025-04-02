<script lang="ts" setup>
import {provide, ref} from "vue";

const generatedId = ref('vgr-field-' + window.crypto.randomUUID());
provide('field-id', generatedId.value);
</script>

<template>
  <div class="[&>[data-label]:has(+*)]:mb-2 [&>*+[data-description]]:mt-2 [&>*+[data-error]]:mt-2" data-field>
    <slot/>
  </div>
</template>