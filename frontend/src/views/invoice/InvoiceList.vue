<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ClientModel } from '@/models/client.model';
import type { InvoiceModel } from '@/models/invoice.model';
import type { VehicleModel } from '@/models/vehicle.model';
import { MainService } from '@/services/main.service';
import { formatDate } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = Number(route.params.id)
const vehicle = ref<VehicleModel>()
const client = ref<ClientModel>()
const invoices = ref<InvoiceModel[]>()
const logout = useLogout()

MainService.useAxios(`/vehicle/${id}`)
    .then(rsp => {
        vehicle.value = rsp.data
        MainService.useAxios(`/client/${rsp.data.clientId}`)
            .then(rsp => client.value = rsp.data)
    })
    .catch(e => logout(e))

MainService.useAxios(`/invoice/vehicle/${id}`)
    .then(rsp => invoices.value = rsp.data)
    .catch(e => logout(e))

function doDelete(invoice: InvoiceModel) {
    MainService.useAxios(`/invoice/${invoice.invoiceId}`, 'delete')
        .then(rsp => invoices.value = invoices.value?.filter(i =>
            i.invoiceId !== invoice.invoiceId
        ))
        .catch(e => logout(e))
}

function calculateTotal(invoice: InvoiceModel) {
    let sum = 0
    invoice.invoiceArticles.forEach(i=>{
        sum += (i.price * Math.abs((100 - i.discount) / 100))
    })
    return sum
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb" v-if="vehicle && client">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink to="/client">Clients</RouterLink>
            </li>
            <li class="breadcrumb-item">
                <RouterLink :to="`/client/${client.clientId}/vehicle`">
                    <span v-if="client.taxId">
                        {{ client.name }} ({{ client.taxId }})
                    </span>
                    <span v-else>{{ client.name }}</span>
                </RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                {{ vehicle.regPlate }} ({{ vehicle.vin }})
            </li>
        </ol>
    </nav>
    <h3>Vehicle Invoices</h3>
    <div class="btn-group">
        <RouterLink class="btn btn-primary" :to="`/invoice/new?vehicle=${id}`">
            <i class="fa-solid fa-plus"></i> Add Invoice
        </RouterLink>
    </div>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Item Count</th>
                <th scope="col">Total</th>
                <th scope="col">Created At</th>
                <th scope="col">Updated At</th>
                <th scope="col">Generated At</th>
                <th scope="col">Paid At</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody v-if="invoices">
            <tr v-for="i of invoices">
                <th scope="row">{{ i.invoiceId }}</th>
                <td>{{ i.invoiceArticles.length }}</td>
                <td>{{ calculateTotal(i) }} RSD</td>
                <td>{{ formatDate(i.createdAt) }}</td>
                <td>{{ formatDate(i.updatedAt) }}</td>
                <td>{{ formatDate(i.generatedAt) }}</td>
                <td>{{ formatDate(i.paidAt) }}</td>
                <td>
                    <div class="btn-group">
                        <RouterLink class="btn btn-sm btn-primary" :to="`/invoice/${i.invoiceId}/article`">
                            <i class="fa-solid fa-list-ul"></i>
                        </RouterLink>
                        <RouterLink class="btn btn-sm btn-success" :to="`/invoice/${i.invoiceId}`">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </RouterLink>
                        <button class="btn btn-sm btn-danger" type="button" @click="doDelete(i)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>