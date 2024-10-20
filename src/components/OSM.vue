<script lang="ts">
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import LatLngTuple from 'leaflet'
import 'leaflet-routing-machine'
import geocoder from '@/utils/geocoder'

export default defineComponent({
  name: 'OSM',
  data() {
    return {
      center: [37.7749, -122.4194] as LatLngTuple.LatLngTuple,
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      coryRight: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

      selectedCoordinates: null
      //geocoder: null
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

      L.Routing.control({
        waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
        routeWhileDragging: true,
        geocoder: geocoder
      }).addTo(map)
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

<style>
.leaflet-routing-container {
  display: none; /* Скрыть весь контейнер маршрутизатора */
}
</style>
