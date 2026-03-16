<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { AuthService } from '@/services/auth.service';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const email = ref<string>('')
const password = ref<string>('')

function doLogin() {
    if (email.value == '' || password.value == '') return
    MainService.login(email.value, password.value)
        .then(rsp => {
            AuthService.setTokens(rsp.data)
            if (route.query.r) {
                router.push(route.query.r as string)
                return
            }

            router.push('/client')
        })
        .catch(e => alert('Neispravan mejl ili lozinka'))
}
</script>

<template>
    <Navigation></Navigation>
    <div class="card auth-card">
        <h5 class="card-header">Login Form</h5>
        <div class="card-body">
            <form v-on:submit.prevent="doLogin()">
                <div class="mb-3">
                    <label for="username" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="username" v-model="email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" v-model="password">
                </div>
                <button class="btn btn-primary">
                    <i class="fa-solid fa-paper-plane"></i> Submit
                </button>
            </form>
        </div>
    </div>
</template>

<style>
.auth-card {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
</style>