<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import { ClientService } from '@/services/client.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const client = ref<any>({
    name: '',
    phone: '',
    email: '',
    taxId: ''
})
const logout = useLogout()

function doCreate() {
    if (client.value.name === '' || client.value.phone === '' || client.value.email === '') {
        alert('You have to set name, phone and email')
        return
    }
    
    ClientService.createClient(client.value)
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
                New client
            </li>
        </ol>
    </nav>
    <h3>New Client</h3>
    <form v-on:submit.prevent="doCreate()">
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
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>