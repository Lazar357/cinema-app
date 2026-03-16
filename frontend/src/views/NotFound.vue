<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';

</script>

<template>
    <Navigation />
    <div class="mb-3 mx-auto text-center">
        <h3>Page Not Found</h3>
        <p>Seams like the page you have requested doesn't exists!</p>
        <RouterLink class="btn btn-sm btn-outline-primary" to="/">
            <i class="fa-solid fa-house"></i> Go Home
        </RouterLink>
    </div>
</template>