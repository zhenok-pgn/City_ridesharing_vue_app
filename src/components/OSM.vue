<script lang="ts">
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import L, { type LeafletEvent } from 'leaflet'
import LatLngTuple from 'leaflet'

export default defineComponent({
  name: 'OSM',
  data() {
    return {
      center: [37.7749, -122.4194] as LatLngTuple.LatLngTuple,
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      coryRight: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

      selectedCoordinates: null
    }
  },
  async mounted() {
    this.setupLeafletMap()
  },
  methods: {
    // initialize OSM map
    setupLeafletMap() {
      const map = L.map('mapContainer').setView(this.center, 13)

      L.tileLayer(this.url, {
        maxZoom: 19,
        attribution: this.coryRight
      }).addTo(map)

      this.setUpClickListener(map)
    },
    // set up listener to get coordinates by tap
    setUpClickListener(map: L.Map) {
      map.on('click', (e: any) => {
        this.selectedCoordinates = e.latlng

        console.log(this.selectedCoordinates)
      })
    }
  }
})
</script>

<template>
  <div id="map">
    <div id="mapContainer" style="height: 600px"></div>
  </div>
</template>
