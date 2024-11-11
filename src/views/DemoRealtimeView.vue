<script setup lang="ts">
import Alert from '@/components/Alert.vue';
import BackButton from '@/components/BackButton.vue';
import { SalesInvoice } from '@/models/SalesInvoice.p';
import { formatNumber } from '@/utils/number';
import { cn } from '@/utils/cn';
import { CheckCircle, InfoIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRealtime } from 'pocketto-vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id === 'new' ? undefined : route.params.id as string | undefined;
let invoice = useRealtime(SalesInvoice, id);
const saved = ref<boolean | undefined>(undefined);
const beingUpdated = ref(false);

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    invoice = useRealtime(SalesInvoice, newId as string);
  }
});

watch(() => saved.value, () => {
  if (saved.value) {
    beingUpdated.value = false;
    setTimeout(() => {
      saved.value = false;
  }, 3000);
  }
});

watch(() => invoice.value.rev, (newRev, oldRev) => {
  if (newRev !== oldRev && oldRev !== undefined) {
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
  invoice.value.subtotalAmount = Number(invoice.value.subtotalAmount);
  invoice.value.taxRate = Number(invoice.value.taxRate);
  invoice.value.taxAmount = Number(invoice.value.taxAmount);
  invoice.value.totalAmount = Number(invoice.value.totalAmount);
  invoice.value.paidAmount = Number(invoice.value.paidAmount);
  await invoice.value.save();
  saved.value = true;
}

async function del() {
  await invoice.value.delete(true);
  router.replace({ name: 'realtime-list' });
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
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">{{ id ? 'Update invoice' : 'Create new invoice' }}</div>
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
        <button
          :disabled="!id"
          className="my-4 bg-error text-white active:scale-90 disabled:active:scale-100 disabled:opacity-50 font-medium py-2 px-4 rounded"
          @click="del"
        >
          Delete
        </button>
      </div>
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
        <input class="border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full" v-model="invoice.customerName" />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Subtotal Amount</label>
        <input
          class="border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full" 
          :value="invoice.subtotalAmount"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || '');
            invoice.taxAmount = value * invoice.taxRate / 100;
            const totalAmount = Number(value) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
            invoice.subtotalAmount = event.target?.value;
          }"
        />
      </div>
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Tax Rate (%)</label>
        <input
          class="border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full"
          :value="invoice.taxRate"
          v-on:input="(event) => {
            const value = parseFloat(event.target?.value || '');
            invoice.taxAmount = invoice.subtotalAmount * value / 100;
            const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
            invoice.totalAmount = totalAmount;
            invoice.taxRate = event.target?.value;
          }"
        />
      </div>
    </div>
    <div class="flex flex-row gap-4">
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Tax Amount</label>
        <input class="border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full disabled:opacity-50" disabled :value="formatNumber(invoice.taxAmount || 0)" />
      </div>
      <div class="mt-4 w-1/2">
        <label class="font-medium text-sm text-slate-500">Grant Total Amount</label>
        <input class="border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full disabled:opacity-50" disabled :value="formatNumber(invoice.totalAmount || 0)" />
      </div>
    </div>
    <div class="mt-4 w-full">
      <label class="font-medium text-sm text-slate-500">Paid Amount</label>
      <input
        :class="cn(
          'border rounded-md px-2 bg-transparent dark:text-slate-100 focus:outline-vue-500 h-12 w-full',
          Number(invoice.paidAmount) > Number(invoice.totalAmount) && 'border-error focus:outline-error',
        )"
        v-model="invoice.paidAmount"
      />
      <div class="text-xs text-error" v-if="Number(invoice.paidAmount) > Number(invoice.totalAmount)">Paid amount should be less than total amount</div>
      <div class="text-xs text-success" v-if="Number(invoice.paidAmount) === Number(invoice.totalAmount)">All cleared!</div>
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
