<template>
  <div
    v-motion
    v-if="show"
    class="absolute top-4 right-4 px-4 py-2 min-w-[100px] rounded-md bg-success font-medium text-white"
    :initial="{
      opacity: 0,
      y: -200,
    }"
    :enter="{
      opacity: 1,
      y: 0,
    }"
    :leave="{
      opacity: 0,
      y: -200,
    }"
  >
    <div class="flex flex-row">
      <slot name="icon"></slot>
      <div>{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  show: boolean;
}>();

</script>