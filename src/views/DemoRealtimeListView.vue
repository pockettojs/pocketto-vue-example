<script setup lang="ts">
import { useRealtimeList } from '@/composables/useRealtimeList';
import { SalesInvoice } from '@/models/SalesInvoice.p';
import { onMounted, ref } from 'vue';
import { faker } from '@faker-js/faker';

const initList = ref<SalesInvoice[]>([]);
const salesInvoices = useRealtimeList(SalesInvoice, { value: initList as any, order: 'desc' });

onMounted(async () => {
  const result = await SalesInvoice.all();
  initList.value = result;
});

function formatNumber(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

</script>

<template>
  <main class="top-0 h-full w-full">
    <div class="text-center">
      <button
        class="my-4 bg-vue-700 hover:bg-vue-900 text-white active:scale-90 font-semibold py-2 px-4 rounded"
        @click="async () => {
          const taxRate = 7;
          const subtotalAmount = faker.number.float({ min: 1, max: 500, fractionDigits: 0 }) * 100;
          let taxAmount = subtotalAmount * taxRate / 100;
          taxAmount = Math.round(taxAmount * 100) / 100;
          const totalAmount = subtotalAmount + taxAmount;

          const customerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
          const invoice = new SalesInvoice();
          invoice.fill({
            customerName,
            subtotalAmount,
            taxRate,
            taxAmount,
            totalAmount,
            paidAmount: faker.number.float({ min: 0, max: totalAmount / 100, fractionDigits: 0 }) * 100,
          });
          await invoice
            .setRandomHexColor()
            .save();
        }"
      >
        Click to add invoice
      </button>
      <table width="100%">
        <thead>
          <tr>
            <th width="5%" class="bg-vue-700 text-white font-medium px-4 py-2"></th>
            <th width="40%" class="bg-vue-700 text-white font-medium px-4 py-2">Customer Name</th>
            <th width="10%" class="bg-vue-700 text-white font-medium px-4 py-2">Subtotal</th>
            <th width="10%" class="bg-vue-700 text-white font-medium px-4 py-2">Tax</th>
            <th width="10%" class="bg-vue-700 text-white font-medium px-4 py-2">Grand Total</th>
            <th width="20%" class="bg-vue-700 text-white font-medium px-4 py-2">Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, index) in salesInvoices"
            :key="invoice.id"
            class="bg-white hover:bg-gray-200 text-gray-800 cursor-pointer"
          >
            <td class="px-4 py-2">
              <div :style="{ backgroundColor: invoice.color }" class="w-4 h-4 rounded-full"></div>
            </td>
            <td class="px-4 py-2">{{ invoice.customerName }}</td>
            <td class="px-4 py-2 text-right">{{ formatNumber(invoice.subtotalAmount) }}</td>
            <td class="px-4 py-2 text-right">{{ formatNumber(invoice.taxAmount) }}</td>
            <td class="px-4 py-2 text-right">{{ formatNumber(invoice.totalAmount) }}</td>
            <td class="px-4 py-2 text-right">{{ formatNumber(invoice.paidAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
