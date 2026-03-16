<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { InvoiceArticleModel } from '@/models/invoice.article.model';
import type { InvoiceModel } from '@/models/invoice.model';
import { MainService } from '@/services/main.service';
import { formatDate } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = Number(route.params.id)
const invoice = ref<InvoiceModel>()
const logout = useLogout()

MainService.useAxios(`/invoice/${id}/details`)
    .then(rsp => invoice.value = rsp.data)
    .catch(e => logout(e))

function doDelete(article: InvoiceArticleModel) {
    MainService.useAxios(`/invoice/article/${article.invoiceArticleId}`, 'delete')
        .then(rsp => {
            if (invoice.value == null) return
            invoice.value.invoiceArticles = invoice.value.invoiceArticles.filter(ia =>
                ia.invoiceArticleId !== article.invoiceArticleId
            )
        })
        .catch(e => logout(e))
}

function calculateTotal() {
    if (!invoice.value) return 0
    let sum = 0
    invoice.value.invoiceArticles.forEach(i => {
        sum += (i.price * Math.abs((100 - i.discount) / 100))
    })
    return sum
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb" v-if="invoice">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink to="/client">Clients</RouterLink>
            </li>
            <li class="breadcrumb-item">
                <RouterLink :to="`/client/${invoice.vehicle.clientId}/vehicle`">
                    <span v-if="invoice.vehicle.client.taxId">
                        {{ invoice.vehicle.client.name }} ({{ invoice.vehicle.client.taxId }})
                    </span>
                    <span v-else>{{ invoice.vehicle.client.name }}</span>
                </RouterLink>
            </li>
            <li class="breadcrumb-item">
                <RouterLink :to="`/vehicle/${invoice.vehicleId}/invoice`">
                    {{ invoice.vehicle.regPlate }} ({{ invoice.vehicle.vin }})
                </RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Invoice
            </li>
        </ol>
    </nav>
    <h3>Invoice Articles</h3>
    <div class="btn-group">
        <RouterLink class="btn btn-primary" :to="`/invoice/article/new?invoice=${id}`">
            <i class="fa-solid fa-plus"></i> Add Invoice Article
        </RouterLink>
    </div>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Part Number</th>
                <th scope="col">Full Price</th>
                <th scope="col">Discount</th>
                <th scope="col">After Discount</th>
                <th scope="col">Updated At</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody v-if="invoice">
            <tr v-for="a of invoice.invoiceArticles">
                <th scope="row">{{ a.invoiceArticleId }}</th>
                <td>{{ a.article.name }}</td>
                <td>{{ a.article.partNumber ?? 'N/A' }}</td>
                <td>
                    <span :title="`Current: ${a.article.price}`">{{ a.price }} RSD</span>
                </td>
                <td>{{ a.discount }} %</td>
                <td>{{ a.price * Math.abs((100 - a.discount) / 100) }} RSD</td>
                <td>{{ formatDate(a.updatedAt ?? a.createdAt) }}</td>
                <td>
                    <div class="btn-group">
                        <RouterLink class="btn btn-sm btn-success" :to="`/invoice/article/${a.invoiceArticleId}`">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </RouterLink>
                        <button class="btn btn-sm btn-danger" type="button" @click="doDelete(a)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="8">Total Amount: {{ calculateTotal() }} RSD</td>
            </tr>
        </tfoot>
    </table>
</template>