import axios from '@/plugins/axios'

export const tripsApi = {
  getTrips: (filteredOptions) =>
    axios.get('/trips', {
      params: {
        localityFromId: filteredOptions.from.id,
        localityToId: filteredOptions.to.id,
        departureDateFrom: filteredOptions.date,
        departureDateTo: filteredOptions.date
      }
    }),
  getTripById: (id: string, segmentId: string) =>
    axios.get(`/trips/${id}`, { params: { segmentId: segmentId } })
}
