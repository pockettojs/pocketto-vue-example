<script setup lang="ts">
import { useRealtimeList } from '@/composables/useRealtimeList';
import { SalesInvoice } from '@/models/SalesInvoice.p';
import { onMounted, ref } from 'vue';
import { faker } from '@faker-js/faker';
import { cn } from '@/utils/cn';
import { useRouter } from 'vue-router';
import { formatNumber } from '@/utils/number';

const initList = ref<SalesInvoice[]>([]);
const salesInvoices = useRealtimeList(SalesInvoice, { value: initList as any, order: 'desc' });
const router = useRouter();

onMounted(async () => {
  const result = await SalesInvoice.query()
    .orderBy('createdAt', 'desc')
    .get();
  initList.value = result;
});

function getPaidColor(percentage: number) {
  if (percentage >= 50) {
    return 'bg-success';
  }
  if (percentage >= 20) {
    return 'bg-warning';
  }
  return 'bg-error';
}

</script>

<template>
  <main class="top-0 h-full w-full">
    <div>
      <div class="flex justify-end gap-4">
        <button
          class="my-4 bg-vue-700 hover:bg-vue-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
          @click="router.push({ name: 'realtime', params: { id: 'new' } })"
        >
          Add New
        </button>
        <button
          class="my-4 bg-vue-700 hover:bg-vue-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
          @click="async () => {
            const taxRate = 7;
            const subtotalAmount = faker.number.float({ min: 1, max: 500, fractionDigits: 0 });
            let taxAmount = subtotalAmount * taxRate / 100;
            taxAmount = Math.round(taxAmount * 100) / 100;
            const totalAmount = subtotalAmount + taxAmount;

            const customerName = `${faker.person.firstName()} ${faker.person.lastName()}`;
            const invoice = new SalesInvoice();
            invoice.fill({
              customerName,
              subtotalAmount,
              taxRate,
              taxAmount,
              totalAmount,
              paidAmount: faker.number.float({ min: 0, max: totalAmount, fractionDigits: 0 }),
            });
            await invoice
              .setRandomHexColor()
              .save();
          }"
        >
          Create Fake Data
        </button>
      </div>

      <div class="table-container">
        <table width="100%">
          <thead>
            <tr>
              <th width="5%" class="rounded-tl-md bg-vue-700 text-white font-medium px-4 py-2"></th>
              <th width="30%" class="bg-vue-700 text-white font-medium px-4 py-2">Customer Name</th>
              <th width="15%" class="bg-vue-700 text-white font-medium px-4 py-2"><div class="text-right">Subtotal</div></th>
              <th width="10%" class="bg-vue-700 text-white font-medium px-4 py-2"><div class="text-right">Tax</div></th>
              <th width="15%" class="bg-vue-700 text-white font-medium px-4 py-2"><div class="text-right">Total</div></th>
              <th width="20%" class="rounded-tr-md bg-vue-700 text-white font-medium px-4 py-2"><div class="text-right">Paid Amount</div></th>
            </tr>
          </thead>
        </table>

        <div class="table-body border-slate-300 rounded-bl-md rounded-br-md border mt-[-2px]">
          <table width="100%">
            <tbody>
              <tr
                v-for="invoice in salesInvoices"
                :key="invoice.id"
                class="bg-white hover:bg-gray-200 text-gray-800 border-b border-slate-300 cursor-pointer"
                @click="() => router.push({ name: 'realtime', params: { id: invoice.id } })"
              >
                <td width="5%" class="pt-4 px-4 py-2">
                  <div :style="{ backgroundColor: invoice.color }" class="w-4 h-4 rounded-full"></div>
                </td>
                <td width="30%" class="px-4 py-2">{{ invoice.customerName }}</td>
                <td width="15%" class="px-4 py-2"><div class="text-right">{{ formatNumber(invoice.subtotalAmount) }}</div></td>
                <td width="10%" class="px-4 py-2"><div class="text-right">{{ formatNumber(invoice.taxAmount) }}</div></td>
                <td width="15%" class="px-4 py-2"><div class="text-right">{{ formatNumber(invoice.totalAmount) }}</div></td>
                <td width="20%" class="py-2">
                  <div :class="cn(
                    'h-1 rounded-full bg-gray-300 mt-[-12px]',
                  )">
                    <div 
                      :class="cn(
                        'h-1 rounded-full',
                        getPaidColor(invoice.paidPercentage),
                      )"
                      :style="{ 
                        width: invoice.paidPercentage + '%',
                      }"
                    ></div>
                  <div class="text-right">{{ formatNumber(invoice.paidAmount) }}</div>
                </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="salesInvoices.length === 0"
            class="flex items-center justify-center h-full"
          >
            <div class="text-slate-500">No data available, click the button above to add fake data</div>
        </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.table-container {
  position: relative;
  width: 100%;
}

.table-container thead {
  position: sticky;
  top: 0;
  z-index: 10; /* Ensure header stays on top */
}

.table-body {
  height: 300px; /* Adjust the height to your needs */
  overflow-y: auto;
}

@media (min-width: 1024px) {
  .table-body {
    height: 600px; /* Adjust the height to your needs */
    overflow-y: auto;
  }
}

.table-body table {
  width: 100%;
  border-collapse: collapse;
}

/* Optional: Keep the column widths consistent between header and body */
th, td {
  text-align: left;
  padding: 8px;
}

</style>