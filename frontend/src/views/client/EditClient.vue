<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ClientModel } from '@/models/client.model';
import { ClientService } from '@/services/client.service';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const client = ref<ClientModel>()
const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)

ClientService.getClientById(id)
    .then(rsp => client.value = rsp.data)
    .catch(e => logout(e))

function doUpdate() {
    ClientService.updateClient(id, client.value)
        .then(rsp => router.push('/client'))
        .catch(e => logout(e))
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink to="/client">Clients</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Edit Client
            </li>
        </ol>
    </nav>
    <h3>Edit Client</h3>
    <form v-if="client" v-on:submit.prevent="doUpdate()">
        <div class="mb-3">
            <label for="id" class="form-label">ID:</label>
            <input type="number" class="form-control" id="id" v-model="client.clientId" disabled>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" v-model="client.name">
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone:</label>
            <input type="text" class="form-control" id="phone" v-model="client.phone">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" v-model="client.email">
        </div>
        <div class="mb-3">
            <label for="tax" class="form-label">Tax ID:</label>
            <input type="text" class="form-control" id="tax" v-model="client.taxId">
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Updated At:</label>
            <input type="text" class="form-control" id="time" :value="MainService.updatedAt(client)" disabled>
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>