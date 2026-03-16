<template>
    <div class="row mb-3">
        <div class="col">
            <div class="input-group flex-nowrap">
                <span class="input-group-text" id="search">
                    <i class="fa-solid fa-search"></i>
                </span>
                <input type="text" class="form-control" aria-describedby="search" v-model="model" @keyup="handleChange">
            </div>
        </div>
        <div class="col">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const model = defineModel<string>()
const emits = defineEmits(['change']);

function handleChange() {
    emits('change', model.value);
}
</script>