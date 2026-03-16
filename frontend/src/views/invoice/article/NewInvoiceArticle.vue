<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ArticleModel } from '@/models/article.model';
import type { InvoiceArticleModel } from '@/models/invoice.article.model';
import type { InvoiceModel } from '@/models/invoice.model';
import { ArticleService } from '@/services/article.service';
import { InvoiceService } from '@/services/invoice.service';
import { MainService } from '@/services/main.service';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const articles = ref<ArticleModel[]>()
const invoice = ref<InvoiceModel>()
const logout = useLogout()

const route = useRoute()
const router = useRouter()
const id = Number(route.query.invoice)

const invoiceArticle = ref({
    invoiceId: id ?? 0,
    articleId: 0,
    price: 0,
    discount: 0
})

async function loadData() {
    try {
        const articleRsp = await ArticleService.getArticles()
        articles.value = articleRsp.data
        invoiceArticle.value.articleId = articleRsp.data[0].articleId
        invoiceArticle.value.price = articleRsp.data[0].price

        const invoiceRsp = await InvoiceService.getInvoiceDetailsById(id)
        invoice.value = invoiceRsp.data
    } catch (e) {
        logout(e)
    }
}

function onArticleChange() {
    invoiceArticle.value.price = articles.value?.find(a => a.articleId == invoiceArticle.value.articleId)?.price ?? 0
}

function doUpdate() {
    MainService.useAxios(`/invoice/article`, 'post', invoiceArticle.value)
        .then(rsp => router.push(`/invoice/${id}/article`))
        .catch(e => logout(e))
}

onMounted(() => loadData())
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                Invoice Article
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Edit
            </li>
        </ol>
    </nav>
    <h3>Edit Invoice Article</h3>
    <form v-if="invoice" v-on:submit.prevent="doUpdate()">
        <div class="mb-3">
            <label for="id" class="form-label">Invoice:</label>
            <input type="text" class="form-control" id="id"
                :value="`#00${invoice.invoiceId} for ${invoice.vehicle.regPlate}`" disabled>
        </div>
        <div class="mb-3" v-if="articles">
            <label for="article" class="form-label">Article:</label>
            <select class="form-select" v-model="invoiceArticle.articleId" id="article" @change="onArticleChange()">
                <option v-for="a of articles" :value="a.articleId">
                    {{ a.name }} ({{ a.price }} RSD)
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Price</label>
            <input type="number" class="form-control" id="time" v-model="invoiceArticle.price">
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Discount:</label>
            <input type="number" class="form-control" id="time" v-model="invoiceArticle.discount">
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>