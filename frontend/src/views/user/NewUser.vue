<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { MainService } from '@/services/main.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const role = ref<string>('user')

function doRegister() {
    if (email.value == '' || password.value == '') return
    MainService.register(email.value, password.value, role.value)
        .then(() => {
            alert('User registered successfully')
            router.push('/')
        })
        .catch(e => {
            console.error(e)
            alert('Error registering user')
        })
}
</script>

<template>
    <Navigation></Navigation>
    <div class="card auth-card mt-4">
        <h5 class="card-header">Register New User</h5>
        <div class="card-body">
            <form v-on:submit.prevent="doRegister()">
                <div class="mb-3">
                    <label for="username" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="username" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Role:</label>
                    <select class="form-control" id="role" v-model="role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button class="btn btn-primary">
                    <i class="fa-solid fa-user-plus"></i> Register
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.auth-card {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
</style>
