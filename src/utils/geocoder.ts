import L from 'leaflet'
import 'leaflet-control-geocoder'

const initializeGeocoder = () => {
  const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: {
      'accept-language': 'ru'
    }
  })
  return geocoder
}

const geocoder = initializeGeocoder()

export default geocoder
