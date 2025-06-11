import axios from '@/plugins/axios'

export const ordersApi = {
  getOrders: () => axios.get('/orders'),
  getOrderById: (order: any) => axios.get(`/orders/${order}`),
  create: (data: any) => axios.post('/orders', data),
  pay: (data: any) => axios.post('/orders/pay', data)
}
