import axios from '@/plugins/axios'

export const authApi = {
  login: (username: string, password: string) =>
    axios.post('/auth/login', { username, password }, { withCredentials: true }),

  refresh: () => axios.post('/auth/refresh', null, { withCredentials: true }),

  logout: () => axios.post('/auth/logout', null, { withCredentials: true }),

  getMe: () => axios.get('/auth/me', { withCredentials: true }),

  register: (
    username: string,
    password: string,
    surname: string,
    name: string,
    patronymic: string,
    phone: string
  ) =>
    axios.post(
      '/auth/passenger/register',
      { username, password, surname, name, patronymic, phone },
      { withCredentials: true }
    )
}
