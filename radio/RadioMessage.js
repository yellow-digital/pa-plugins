import {ref} from 'vue'

async function loadStations() {
    const resp = await fetch(
      "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/NL"
    );
    const stations = await resp.json();
    return stations
  }

export const RadioMessage = {
    props: {
      message: Object,
    },
    setup(props) {
      console.log(props)

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

      return {
        stations,
        loadStations,
        next,
        open(station) {
          // open url in new window
          window.open(station.url_resolved, '_blank');
        },
        current,
      }
    },
    template: `
    <div>
      <small>{{stations.length}} stations available</small>
      <div v-if="current">
      <p>Playing <b>{{current.name}}</b></p>
      <audio :key="current.url_resolved" controls autoplay style="width: 300px"><source :src="current.url_resolved" type="audio/mpeg"></audio>
      <button @click='next()'>next</button>
      <button @click='open(current)'>open</button>
      </div>
    </div>
    `
  }