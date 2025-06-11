<script lang="ts">
import { defineComponent, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-routing-machine'
import type { LatLngExpression, Map, Marker, RoutingControl } from 'leaflet'

export default defineComponent({
  name: 'OSM',
  props: {
    waypoints: {
      type: Array as () => LatLngExpression[],
      required: true
    },
    highlightedSegment: {
      type: Object as () => { fromIndex: number; toIndex: number } | null,
      default: null
    },
    busLocation: {
      type: Object as () => LatLngExpression | null,
      default: null
    },
    mapId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      map: null as Map | null,
      busMarker: null as Marker | null,
      highlightedControl: null as RoutingControl | null,
      mainControl: null as RoutingControl | null,
      center: [50, 85] as [number, number]
    }
  },
  mounted() {
    this.initMap()

    // следим за изменениями
    watch(() => this.waypoints, this.drawMainRoute, { immediate: true })
    watch(() => this.busLocation, this.updateBusMarker, { immediate: true })
    watch(() => this.highlightedSegment, this.updateHighlightedSegment, { immediate: true })
  },
  methods: {
    initMap() {
      this.map = L.map(this.mapId).setView(this.center, 3)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map)
    },

    drawMainRoute(waypoints: LatLngExpression[]) {
      if (
        this.mainControl &&
        this.areLatLngArraysEqual(
          this.mainControl.getWaypoints().map((wp) => [wp.lat, wp.lng]),
          waypoints
        )
      ) {
        return
      }

      if (this.mainControl) {
        this.map!.removeControl(this.mainControl)
        this.mainControl = null
      }

      const points = waypoints.map((p) => L.latLng(p))

      this.mainControl = L.Routing.control({
        waypoints: points,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: '#3388ff', weight: 4 }]
        }
      }).addTo(this.map!)

      this.map!.fitBounds(L.latLngBounds(points), { padding: [30, 30] })
    },

    updateBusMarker(location: LatLngExpression | null) {
      if (this.busMarker) {
        this.map!.removeLayer(this.busMarker)
        this.busMarker = null
      }

      if (location) {
        this.busMarker = L.marker(location, {
          icon: L.icon({
            iconUrl: '/icons/bus.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        }).addTo(this.map!)
      }
    },

    updateHighlightedSegment(segment: { fromIndex: number; toIndex: number } | null) {
      const prevPoints = this.highlightedControl?.getWaypoints().map((wp) => [wp.lat, wp.lng])
      const newPoints = segment ? this.waypoints.slice(segment.fromIndex, segment.toIndex + 1) : []

      if (this.highlightedControl && this.areLatLngArraysEqual(prevPoints ?? [], newPoints)) {
        return
      }

      if (this.highlightedControl) {
        this.map!.removeControl(this.highlightedControl)
        this.highlightedControl = null
      }

      if (!segment) return

      const { fromIndex, toIndex } = segment
      const segmentPoints = this.waypoints.slice(fromIndex, toIndex + 1).map((p) => L.latLng(p))

      this.highlightedControl = L.Routing.control({
        waypoints: segmentPoints,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        createMarker: () => null,
        show: false,
        lineOptions: {
          styles: [{ color: 'red', weight: 6, opacity: 0.8 }]
        }
      }).addTo(this.map!)
    },

    areLatLngArraysEqual(
      a: LatLngExpression[] | [number, number][],
      b: LatLngExpression[] | [number, number][]
    ) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        const [aLat, aLng] = Array.isArray(a[i])
          ? (a[i] as [number, number])
          : [a[i]['lat'], a[i]['lng']]
        const [bLat, bLng] = Array.isArray(b[i])
          ? (b[i] as [number, number])
          : [b[i]['lat'], b[i]['lng']]
        if (Math.abs(aLat - bLat) > 1e-6 || Math.abs(aLng - bLng) > 1e-6) {
          return false
        }
      }
      return true
    }
  }
})
</script>

<template>
  <div :id="mapId" class="map-container"></div>
</template>

<style>
.leaflet-routing-container {
  display: none; /* Скрыть весь контейнер маршрутизатора */
}

.map-container {
  height: 100%;
}
</style>
