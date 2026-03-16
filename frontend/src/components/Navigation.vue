<script setup lang="ts">
import { useLogout } from '@/hooks/logout.hook';
import { AuthService } from '@/services/auth.service';

const logout = useLogout()
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
        <div class="container">
            <RouterLink class="navbar-brand" to="/">ASD2026</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <template v-if="AuthService.getRefreshToken()">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/client">Clients</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/article">Articles</RouterLink>
                        </li>
                        <li class="nav-item">
                            <button type="button" class="nav-link" @click="logout">Logout</button>
                        </li>
                    </template>
                    <li class="nav-item" v-else>
                        <RouterLink class="nav-link" to="/login">Login</RouterLink>
                    </li>
                </ul>
                <span class="navbar-text" v-if="AuthService.getRefreshToken()">
                    <i class="fa-solid fa-user"></i> {{ AuthService.getUserEmail() }}
                </span>
            </div>
        </div>
    </nav>
</template>