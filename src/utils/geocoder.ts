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

const findByOsmId = async (osmType: string, osmId: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&format=json&accept-language=ru`
    )

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Ошибка: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export default geocoder
export { findByOsmId }
