<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ArticleModel } from '@/models/article.model';
import { ArticleService } from '@/services/article.service';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const article = ref<ArticleModel>()
const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)
ArticleService.getArticleById(id)
    .then(rsp => article.value = rsp.data)
    .catch(e => logout(e))

function doUpdate() {
    ArticleService.updateArticle(id, article.value)
        .then(rsp => router.push('/article'))
        .catch(e => logout(e))
}
</script>

<template>
    <Navigation />
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <RouterLink to="/article">Articles</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                Edit Article
            </li>
        </ol>
    </nav>
    <h3>Edit Article</h3>
    <form v-if="article" v-on:submit.prevent="doUpdate()">
        <div class="mb-3">
            <label for="id" class="form-label">ID:</label>
            <input type="number" class="form-control" id="id" v-model="article.articleId" disabled>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" v-model="article.name">
        </div>
        <div class="mb-3">
            <label for="part" class="form-label">Part Number:</label>
            <input type="text" class="form-control" id="part" v-model="article.partNumber">
        </div>
        <div class="mb-3">
            <label for="price" class="form-label">Price:</label>
            <input type="number" class="form-control" id="price" v-model="article.price">
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Updated At:</label>
            <input type="text" class="form-control" id="time" :value="MainService.updatedAt(article)" disabled>
        </div>
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>