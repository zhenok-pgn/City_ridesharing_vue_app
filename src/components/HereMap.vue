<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HereMap',
  props: {
    center: Object
    // center object { lat: 40.730610, lng: -73.935242 }
  },
  data() {
    return {
      platform: null,
      apikey: 'BxCHADoLHTtDSi3O4swMxIokyDODTOUaFlYGGphnQfo'
      // You can get the API KEY from developer.here.com
    }
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    })
    this.platform = platform
    this.initializeHereMap()
  },
  methods: {
    initializeHereMap() {
      // rendering map

      const mapContainer = this.$refs.hereMap
      const H = window.H
      // Obtain the default map types from the platform object
      let maptypes = this.platform.createDefaultLayers()

      // Instantiate (and display) a map object:
      let map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 10,
        center: this.center
        // center object { lat: 40.730610, lng: -73.935242 }
      })

      addEventListener('resize', () => map.getViewPort().resize())

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

      // add UI
      H.ui.UI.createDefault(map, maptypes)
      // End rendering the initial map

      //
      this.setUpClickListener(map)
    },
    setUpClickListener(map: any) {
      // Attach an event listener to map display
      // obtain the coordinates and display in an alert box.
      map.addEventListener('tap', function (evt: any) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY)
        console.log(
          'Clicked at ' +
            Math.abs(coord.lat.toFixed(4)) +
            (coord.lat > 0 ? 'N' : 'S') +
            ' ' +
            Math.abs(coord.lng.toFixed(4)) +
            (coord.lng > 0 ? 'E' : 'W')
        )
      })
    }
  }
})
</script>

<template>
  <div id="map">
    <!--In the following div the HERE Map will render-->
    <div id="mapContainer" style="height: 600px; width: 100%" ref="hereMap"></div>
  </div>
</template>

<style scoped>
#map {
  width: 60vw;
  min-width: 360px;
  text-align: center;
  margin: 5% auto;
  background-color: #ccc;
}
</style>
