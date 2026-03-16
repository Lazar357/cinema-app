<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { InvoiceModel } from '@/models/invoice.model';
import type { VehicleModel } from '@/models/vehicle.model';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const vehicles = ref<VehicleModel[]>()
const invoice = ref<InvoiceModel>()
const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)

MainService.useAxios(`/invoice/${id}`)
    .then(rsp => {
        invoice.value = rsp.data
        MainService.useAxios(`/vehicle/client/vehicle/${rsp.data.vehicleId}`)
            .then(rsp => vehicles.value = rsp.data)
            .catch(e => logout(e))
    })

function doUpdate() {
    MainService.useAxios(`/invoice/${id}`, 'put', invoice.value)
        .then(rsp => router.push(`/vehicle/${invoice.value?.vehicleId}/invoice`))
        .catch(e => logout(e))
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                Invoices
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Edit
            </li>
        </ol>
    </nav>
    <h3>Edit Invoice</h3>
    <form v-if="invoice" v-on:submit.prevent="doUpdate()">
        <div class="mb-3">
            <label for="id" class="form-label">ID:</label>
            <input type="number" class="form-control" id="id" v-model="invoice.invoiceId" disabled>
        </div>
        <div class="mb-3" v-if="vehicles">
            <label for="vehicle" class="form-label">Vehicle:</label>
            <select class="form-select" v-model="invoice.vehicleId" id="vehicle">
                <option v-for="v of vehicles" :value="v.vehicleId">
                    {{ v.regPlate }} ({{ v.vin }})
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Updated At:</label>
            <input type="text" class="form-control" id="time" :value="MainService.updatedAt(invoice)" disabled>
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>