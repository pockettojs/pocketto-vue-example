<script setup lang="ts">
import { useRealtimeList } from '@/composables/useRealtimeList';
import { Dummy } from '@/models/Dummy.p';
import { onMounted, ref } from 'vue';

const initDummyList = ref<Array<Dummy>>([]);
const dummyList = useRealtimeList(Dummy, { value: initDummyList as any, order: 'desc' });

onMounted(async () => {
  const result = await Dummy.all();
  initDummyList.value = result;
});

</script>

<template>
  <main style="display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center;">
      <button
        style="
          padding: 10px 20px;
          background-color: rgb(229, 231, 235);
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px;
        "
        @click="async () => {
          const dummy = new Dummy();
          dummy
            .setRandomName()
            .setRandomHexColor();
          await dummy.save();
        }"
      >
        Click to add Dummy
      </button>
      <p 
        v-for="(dummy, index) in dummyList" 
        :key="index" 
        :style="{ color: dummy.color }"
      >
        {{ dummy.name }}
      </p>
    </div>
  </main>
</template>
