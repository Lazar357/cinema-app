<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue'
import Search from '@/components/Search.vue'
import { useLogout } from '@/hooks/logout.hook'
import type { ClientModel } from '@/models/client.model'
import { ClientService } from '@/services/client.service'
import { onMounted, ref } from 'vue'

const clients = ref<ClientModel[]>()
const logout = useLogout()
const search = ref('')
const expandedClient = ref<number | null>(null)

function loadData() {
  ClientService.getClients(search.value)
    .then((rsp) => (clients.value = rsp.data))
    .catch((e) => logout(e))
}

async function doDelete(client: ClientModel) {
  if (!confirm(`Are you sure you want to delete client ${client.name}?`)) return
  try {
    if (clients.value == undefined) return
    await ClientService.deleteClient(client.clientId)
    clients.value = clients.value.filter((c) => c.clientId !== client.clientId)
  } catch (e) {
    logout(e)
  }
}

function toggleInfo(clientId: number) {
  if (expandedClient.value === clientId) {
    expandedClient.value = null
  } else {
    expandedClient.value = clientId
  }
}

onMounted(() => loadData())
</script>

<template>
  <Navigation />
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Clients</h3>
      <RouterLink class="btn btn-primary" to="/client/new">
        <i class="fa-solid fa-plus"></i> Add Client
      </RouterLink>
    </div>

    <Search v-model="search" @change="loadData" class="mb-4" />

    <div class="row align-items-start" v-if="clients">
      <div v-for="client of clients" :key="client.clientId" class="col-md-4 mb-4">
        <div class="card shadow-sm client-card">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ client.name }}</h5>
            <p class="card-text"><i class="fa-solid fa-phone me-2"></i> {{ client.phone }}</p>

            <div v-if="expandedClient === client.clientId" class="mt-3 border-top pt-3">
              <p class="card-text"><i class="fa-solid fa-envelope me-2"></i> {{ client.email }}</p>
              <p class="card-text" v-if="client.taxId">
                <i class="fa-solid fa-hashtag me-2"></i> Tax ID: {{ client.taxId }}
              </p>
              <div class="d-grid mt-3">
                <RouterLink class="btn btn-outline-info" :to="`/client/${client.clientId}/vehicle`">
                  <i class="fa-solid fa-car me-2"></i> View Vehicles
                </RouterLink>
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-secondary" @click="toggleInfo(client.clientId)">
              <i
                class="fa-solid"
                :class="expandedClient === client.clientId ? 'fa-chevron-up' : 'fa-info-circle'"
              ></i>
              {{ expandedClient === client.clientId ? 'Less' : 'More Info' }}
            </button>
            <div class="btn-group">
              <RouterLink class="btn btn-sm btn-success" :to="`/client/${client.clientId}`">
                <i class="fa-solid fa-pen-to-square"></i>
              </RouterLink>
              <button class="btn btn-sm btn-danger" type="button" @click="doDelete(client)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="clients === undefined" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="alert alert-info text-center">No clients found.</div>
  </div>
</template>

<style scoped>
.client-card {
  transition: all 0.2s ease-in-out;
  min-height: 160px;
}
.client-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
