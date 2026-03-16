<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useLogout } from '@/hooks/logout.hook';
import { ArticleService } from '@/services/article.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const article = ref({
    name: '',
    price: 0,
    partNumber: ''
})
const router = useRouter()
const logout = useLogout()

function doCreate() {
    ArticleService.createArticle(article.value)
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
                New Article
            </li>
        </ol>
    </nav>
    <h3>New Article</h3>
    <form v-if="article" v-on:submit.prevent="doCreate()">
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
        <button class="btn btn-primary tbn-success">
            <i class="fa-solid fa-floppy-disk"></i> Save Now
        </button>
    </form>
</template>