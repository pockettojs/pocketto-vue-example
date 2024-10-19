<script setup lang="ts">
import Alert from '@/components/Alert.vue';
import BackButton from '@/components/BackButton.vue';
import { useRealtimeValue } from '@/composables/useRealtimeValue';
import { SalesInvoice } from '@/models/SalesInvoice.p';
import { formatNumber } from '@/utils/number';
import { cn } from '@/utils/tailwind';
import { CheckCircle, InfoIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = route.params.id === 'new' ? undefined : route.params.id as string | undefined;
const invoice = useRealtimeValue(SalesInvoice, id);
const saved = ref<boolean | undefined>(undefined);
const beingUpdated = ref(false);

watch(() => saved.value, () => {
  if (saved.value) {
    beingUpdated.value = false;
    setTimeout(() => {
      saved.value = false;
  }, 3000);
  }
});

watch([() => invoice.value._meta._rev, () => saved.value], ([rev, isSaved], [oldRev]) => {
  if (isSaved === undefined && rev !== oldRev && oldRev !== undefined) {
    beingUpdated.value = true;
  }
});

watch(() => beingUpdated.value, () => {
  if (beingUpdated.value) {
    setTimeout(() => {
        beingUpdated.value = false;
    }, 3000);
  }
});

async function save() {
  await invoice.value.save();
  saved.value = true;
}
</script>

<template>
  <div>
    <alert type="success" title="Invoice saved!" :show="saved">
      <template #icon>
        <check-circle class="w-5 h-5 inline-block mr-2 mt-0.5" />
      </template>
    </alert>
    <alert type="info" title="Invoice was updated by other user!" :show="beingUpdated">
      <template #icon>
        <info-icon class="w-5 h-5 inline-block mr-2 mt-0.5" />
      </template>
    </alert>
    <div class="flex flex-row gap-4">
      <back-button
        @click="router.replace({ name: 'realtime-list' })"
      />
      <button
        class="my-4 bg-vue-700 hover:bg-vue-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
        @click="save"
      >
        Save
      </button>
    </div>
    <div class="flex flex-row gap-6">
      <div class="mt-4 w-[5%]">
        <label class="font-medium text-sm text-slate-500">Color</label>
        <div 
          :class="cn(
            'w-8 h-8 mt-2 mx-1 rounded-full cursor-pointer',
            !invoice.color && 'border border-slate-300',
          )" 
          :style="{
            backgroundColor: invoice.color,
          }"
          @click="invoice.setRandomHexColor()"
        ></div>
      </div>
      <div class="mt-4 w-[95%]">
        <label class="font-medium text-sm text-slate-500">Customer Name</label>
        <input class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full" v-model="invoice.customerName" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Subtotal Amount</label>
        <input
          class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full" 
          :value="invoice.subtotalAmount"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || 0);
            invoice.taxAmount = value * invoice.taxRate / 100;
            const totalAmount = Number(value) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
            invoice.subtotalAmount = Number(value);
          }"
        />
      </div>
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Tax Rate (%)</label>
        <input
          class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full"
          :value="invoice.taxRate"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || 0);
            invoice.taxAmount = invoice.subtotalAmount * value / 100;
            const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
            invoice.taxRate = Number(value);
          }"
        />
      </div>
    </div>
    
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Tax Amount</label>
        <input class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full disabled:opacity-50" disabled :value="formatNumber(invoice.taxAmount || 0)" />
      </div>
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Grant Total Amount</label>
        <input class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full disabled:opacity-50" disabled :value="formatNumber(invoice.totalAmount || 0)" />
      </div>
    </div>
    <div class="mt-4 w-full">
      <label class="font-medium text-sm text-slate-500">Paid Amount</label>
      <input
        :class="cn(
          'border rounded-md px-2 focus:outline-vue-500 h-12 w-full',
          Number(invoice.paidAmount) > Number(invoice.totalAmount) && 'border-red-500 focus:outline-red-500',
        )"
        v-model="invoice.paidAmount"
      />
      <div class="text-xs text-red-500" v-if="Number(invoice.paidAmount) > Number(invoice.totalAmount)">Paid amount should be less than total amount</div>
      <div class="text-xs text-vue-500" v-if="Number(invoice.paidAmount) === Number(invoice.totalAmount)">All cleared!</div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
