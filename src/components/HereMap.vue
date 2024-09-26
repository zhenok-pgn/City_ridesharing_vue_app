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
      apikey: 'BxCHADoLHTtDSi3O4swMxIokyDODTOUaFlYGGphnQfo',
      platform: null,
      selectedCoordinates: null,
      map: null
    }
  },
  async mounted() {
    // Initialize the platform object:
    this.platform = new window.H.service.Platform({ apikey: this.apikey })
    this.initializeHereMap()
  },
  watch: {
    //установить точку при изменении координаты по шелчку мыши
    selectedCoordinates(newSelectedCoordinates) {
      let geocoder = (this.platform! as any).getSearchService(),
        reverseGeocodingParameters = {
          at: `${newSelectedCoordinates.lat.toFixed(4)},${newSelectedCoordinates.lng.toFixed(4)},150`,
          limit: '1'
        }

      geocoder.reverseGeocode(
        reverseGeocodingParameters,
        //onSuccess,
        //onError
        // Add a marker on click
        (result: any) => {
          let marker = new window.H.map.Marker(result.items[0].position)
          this.map.addObject(marker)
          console.log(result)
        },
        //onError
        () => {
          console.log('Cannot get addres by coordinates!')
        }
      )
    }
  },
  methods: {
    // rendering map
    initializeHereMap() {
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
      this.map = map

      addEventListener('resize', () => map.getViewPort().resize())
      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

      // add UI
      H.ui.UI.createDefault(map, maptypes)
      // End rendering the initial map

      this.setUpClickListener(map)
    },
    //set up listener to get coordinates by tap
    setUpClickListener(map: any) {
      map.addEventListener('tap', (evt: any) => {
        this.selectedCoordinates = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        )

        console.log(
          'Clicked at ' +
            Math.abs(this.selectedCoordinates.lat.toFixed(4)) +
            (this.selectedCoordinates.lat > 0 ? 'N' : 'S') +
            ' ' +
            Math.abs(this.selectedCoordinates.lng.toFixed(4)) +
            (this.selectedCoordinates.lng > 0 ? 'E' : 'W')
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
