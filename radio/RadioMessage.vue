<script setup>
import {ref} from 'vue'

const stations = ref([])
const current = ref(null)

function next() {
    const station = stations.value[Math.floor(Math.random() * stations.value.length)];
    current.value = station
}
async function load() {
    stations.value = await loadStations()
    next()
}

load()
</script>

<template>
    <div>
        <small>{{ stations.length }} stations available</small>
        <div v-if="current">
            <p>Playing <b>{{ current.name }}</b></p>
            {{ current.url_resolved }}
            <audio controls autoplay style="width: 300px">
                <source :src="current.url_resolved" type="audio/mpeg">
            </audio>
            <button @click='next()'>next</button>
            <button @click='open(current)'>open</button>
        </div>
    </div>
</template>