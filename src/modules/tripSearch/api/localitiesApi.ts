import axios from '@/plugins/axios'

export const localitiesApi = {
  getLocalities: () => axios.get('/localities'),
  getLocalityById: (id: string) => axios.get(`/localities/${id}`)
}
