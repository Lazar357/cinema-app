<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import Search from '@/components/Search.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { ArticleModel } from '@/models/article.model';
import { ArticleService } from '@/services/article.service';
import { onMounted, ref } from 'vue';

const articles = ref<ArticleModel[]>()
const logout = useLogout()
const search = ref('')

function loadData() {
    ArticleService.getArticles(search.value)
        .then(rsp => articles.value = rsp.data)
        .catch(e => logout(e))
}

async function doDelete(article: ArticleModel) {
    try {
        if (articles.value == undefined) return
        await ArticleService.deleteArticle(article.articleId)
        articles.value = articles.value.filter(a =>
            a.articleId !== article.articleId
        )
    } catch (e) {
        logout(e)
    }
}

onMounted(() => loadData())
</script>

<template>
    <Navigation />
    <h3>Articles</h3>
    <Search v-model="search" @change="loadData">
        <div class="btn-group">
            <RouterLink class="btn btn-primary" to="/article/new">
                <i class="fa-solid fa-plus"></i> Add Article
            </RouterLink>
        </div>
    </Search>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Part Number</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody v-if="articles">
            <tr v-for="article of articles">
                <th scope="row">{{ article.articleId }}</th>
                <td>{{ article.name }}</td>
                <td>{{ article.partNumber ? article.partNumber : 'N/A' }}</td>
                <td>{{ article.price }} RSD</td>
                <td>
                    <div class="btn-group">
                        <RouterLink class="btn btn-sm btn-success" :to="`/article/${article.articleId}`">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </RouterLink>
                        <button class="btn btn-sm btn-danger" type="button" @click="doDelete(article)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>