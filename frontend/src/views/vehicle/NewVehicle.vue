<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ClientModel } from '@/models/client.model';
import type { ModelModel } from '@/models/model.model';
import { ClientService } from '@/services/client.service';
import { VehicleService } from '@/services/vehicle.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const clients = ref<ClientModel[]>()
const models = ref<ModelModel[]>()
const router = useRouter()
const route = useRoute()
const logout = useLogout()

function extractId() {
    if (!route.query.client) return 0
    const id = Number(route.query.client)
    if (isNaN(id)) return 0
    return id
}

const vehicle = ref({
    clientId: extractId(),
    modelId: 0,
    regPlate: '',
    vin: '',
    year: new Date().getFullYear()
})

ClientService.getClients()
    .then(rsp => {
        if (vehicle.value.clientId === 0) {
            vehicle.value.clientId = rsp.data[0].clientId
        }
        clients.value = rsp.data
    })
    .catch(e => logout(e))

VehicleService.getVehicleModels()
    .then(rsp => {
        vehicle.value.modelId = rsp.data[0].modelId
        models.value = rsp.data
    })
    .catch(e => logout(e))

function doCreate() {
    VehicleService.createVehicle(vehicle.value)
        .then(rsp => router.push(`/client/${vehicle.value?.clientId}/vehicle`))
        .catch(e => logout(e))
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                Vehicles
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                New Vehicle
            </li>
        </ol>
    </nav>
    <h3>Edit Vehicle</h3>
    <form v-on:submit.prevent="doCreate()">
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
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>