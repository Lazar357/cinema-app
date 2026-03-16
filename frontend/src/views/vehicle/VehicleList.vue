<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import Search from '@/components/Search.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ClientModel } from '@/models/client.model';
import type { VehicleModel } from '@/models/vehicle.model';
import { ClientService } from '@/services/client.service';
import { VehicleService } from '@/services/vehicle.service';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const vehicles = ref<VehicleModel[]>()
const route = useRoute()
const id = Number(route.params.id)
const search = ref('')
const logout = useLogout()

const client = ref<ClientModel>()
ClientService.getClientById(id)
    .then(rsp => client.value = rsp.data)
    .catch(e => logout(e))

function loadData() {
    VehicleService.getVehicleByClientId(id, search.value)
        .then(rsp => vehicles.value = rsp.data)
        .catch(e => logout(e))
}

function doDelete(model: VehicleModel) {
    VehicleService.deleteVehicle(model.vehicleId)
        .then(rsp => vehicles.value = vehicles.value?.filter(v => v.vehicleId !== model.vehicleId))
        .catch(e => logout(e))
}

onMounted(() => loadData())
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb" v-if="client">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink to="/client">Clients</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                <span v-if="client.taxId">
                    {{ client.name }} ({{ client.taxId }})
                </span>
                <span v-else>{{ client.name }}</span>
            </li>
        </ol>
    </nav>
    <h3>Client Vehicles</h3>
    <Search v-model="search" @change="loadData">
        <div class="btn-group">
            <RouterLink class="btn btn-primary" :to="`/vehicle/new?client=${id}`">
                <i class="fa-solid fa-plus"></i> Add Vehicle
            </RouterLink>
        </div>
    </Search>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Model</th>
                <th scope="col">VIN</th>
                <th scope="col">Plate</th>
                <th scope="col">Year</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody v-if="vehicles">
            <tr v-for="v of vehicles">
                <th scope="row">{{ v.vehicleId }}</th>
                <td>{{ v.model.name }}</td>
                <td>{{ v.vin }}</td>
                <td>{{ v.regPlate }}</td>
                <td>{{ v.year }}</td>
                <td>
                    <div class="btn-group">
                        <RouterLink class="btn btn-sm btn-light" :to="`/vehicle/${v.vehicleId}/invoice`">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </RouterLink>
                        <RouterLink class="btn btn-sm btn-success" :to="`/vehicle/${v.vehicleId}`">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </RouterLink>
                        <button class="btn btn-sm btn-danger" type="button" @click="doDelete(v)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>