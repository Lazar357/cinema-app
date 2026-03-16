<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { VehicleModel } from '@/models/vehicle.model';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const vehicles = ref<VehicleModel[]>()
const route = useRoute()
const router = useRouter()
const id = Number(route.query.vehicle)
const invoice = ref({
    vehicleId: id
})
const logout = useLogout()

MainService.useAxios(`/vehicle/client/vehicle/${id}`)
    .then(rsp => vehicles.value = rsp.data)
    .catch(e => logout(e))

function doCreate() {
    MainService.useAxios(`/invoice`, 'post', invoice.value)
        .then(rsp => router.push(`/vehicle/${invoice.value.vehicleId}/invoice`))
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
    <h3>New Invoice</h3>
    <form v-on:submit.prevent="doCreate()">
        <div class="mb-3" v-if="vehicles">
            <label for="vehicle" class="form-label">Vehicle:</label>
            <select class="form-select" v-model="invoice.vehicleId" id="vehicle">
                <option v-for="v of vehicles" :value="v.vehicleId">
                    {{ v.regPlate }} ({{ v.vin }}) {{ v.vehicleId }}
                </option>
            </select>
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>