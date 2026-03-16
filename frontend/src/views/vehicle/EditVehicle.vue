<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ClientModel } from '@/models/client.model';
import type { ModelModel } from '@/models/model.model';
import type { VehicleModel } from '@/models/vehicle.model';
import { ClientService } from '@/services/client.service';
import { MainService } from '@/services/main.service';
import { VehicleService } from '@/services/vehicle.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const vehicle = ref<VehicleModel>()
const clients = ref<ClientModel[]>()
const models = ref<ModelModel[]>()
const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)

VehicleService.getVehicleById(id)
    .then(rsp => vehicle.value = rsp.data)
    .catch(e => logout(e))

ClientService.getClients()
    .then(rsp => clients.value = rsp.data)
    .catch(e => logout(e))

VehicleService.getVehicleModels()
    .then(rsp => models.value = rsp.data)
    .catch(e => logout(e))

function doUpdate() {
    VehicleService.updateVehicle(id, vehicle.value)
        .then(rsp => router.push(`/client/${vehicle.value?.clientId}/vehicle`))
        .catch(e => logout(e))
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink :to="`/client/${id}/vehicle`">
                    Vehicles
                </RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Edit Vehicle
            </li>
        </ol>
    </nav>
    <h3>Edit Vehicle</h3>
    <form v-if="vehicle" v-on:submit.prevent="doUpdate()">
        <div class="mb-3">
            <label for="id" class="form-label">ID:</label>
            <input type="number" class="form-control" id="id" v-model="vehicle.vehicleId" disabled>
        </div>
        <div class="mb-3" v-if="clients">
            <label for="client" class="form-label">Client:</label>
            <select class="form-select" v-model="vehicle.clientId" id="client">
                <option v-for="c of clients" :value="c.clientId">
                    <span v-if="c.taxId">
                        {{ c.name }} ({{ c.taxId }})
                    </span>
                    <span v-else>{{ c.name }}</span>
                </option>
            </select>
        </div>
        <div class="mb-3" v-if="models">
            <label for="model" class="form-label">Model:</label>
            <select class="form-select" v-model="vehicle.modelId" id="model">
                <option v-for="m of models" :value="m.modelId"> {{ m.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="reg" class="form-label">Registration Plate:</label>
            <input type="text" class="form-control" id="reg" v-model="vehicle.regPlate">
        </div>
        <div class="mb-3">
            <label for="vin" class="form-label">VIN:</label>
            <input type="text" class="form-control" id="vin" v-model="vehicle.vin">
        </div>
        <div class="mb-3">
            <label for="year" class="form-label">Model Year:</label>
            <input type="number" class="form-control" id="year" v-model="vehicle.year">
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Updated At:</label>
            <input type="text" class="form-control" id="time" :value="MainService.updatedAt(vehicle)" disabled>
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>