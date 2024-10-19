<script setup lang="ts">
import { useRealtimeValue } from '@/composables/useRealtimeValue';
import { SalesInvoice } from '@/models/SalesInvoice.p';
import { formatNumber } from '@/utils/number';
import { cn } from '@/utils/tailwind';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id as string;
const invoiceRef = ref<SalesInvoice>(new SalesInvoice());
const invoice = useRealtimeValue<SalesInvoice>(invoiceRef as any);

onMounted(async () => {
  if (id === 'new') return;
  const data = await SalesInvoice.find(id);
  if (!data) return;
  invoiceRef.value = data;
});

async function save() {
  await invoiceRef.value?.save();
}

</script>

<template>
  <div>
    <button
      class="my-4 bg-vue-700 hover:bg-vue-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
      @click="save"
    >
      Save
    </button>
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-[100%]">
        <label class="font-medium text-sm text-slate-500">Customer Name</label>
        <input class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full" v-model="invoice.customerName" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Subtotal Amount</label>
        <input
          class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full" 
          v-model="invoice.subtotalAmount"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || 0);
            const taxRate = parseFloat(invoice.taxRate || 0);
            invoice.taxAmount = value * taxRate / 100;
            const totalAmount = Number(value) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
          }"
        />
      </div>
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Tax Rate (%)</label>
        <input
          class="border rounded-md px-2 focus:outline-vue-500 h-12 w-full"
          v-model="invoice.taxRate"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || 0);
            invoice.taxAmount = invoice.subtotalAmount * value / 100;
            const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
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
