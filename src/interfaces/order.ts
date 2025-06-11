import type { ITrip } from '@/modules/tripSearch/interfaces/trip'
import type { IRouteSegmentSchedule } from './route'
import type { IBaseObject } from '@/utils/baseObject'

export interface ICreateOrderRequest {
  tripId: string
  segmentId: string
  seatIds: string[]
}

export interface IOrderNumber {
  userId: string
  createdAt: string
}

export interface IOrder {
  orderNumber: IOrderNumber
  trip: ITrip
  routeSegmentSchedule: IRouteSegmentSchedule
  bookings: IBooking[]
}

export interface IBooking extends IBaseObject {
  seatNumber: string
  bookingStatus: string
  ticket: ITicket
}

export interface ITicket extends IBaseObject {
  passenger: IPassenger
  price: number
  createdAt: string
}

export interface IPayOrderRequest {
  orderNumber: IOrderNumber
  passengers: IPassenger[]
}

export interface IPassenger {
  surname: string
  name: string
  patronymic: string
  dayOfBirth: string
  gender: number
  documentType: number
  documentNumber: string
}

export interface IdentificationDocument {
  name: string
  id: number
}

export interface Gender {
  name: string
  id: number
}

export const identificationDocuments: IdentificationDocument[] = [
  { name: 'Паспорт РФ', id: 0 },
  { name: 'Заграничный паспорт', id: 1 },
  { name: 'Свидетельство о рождении', id: 2 },
  { name: 'Военный билет', id: 3 }
]

export const genders: Gender[] = [
  { name: 'Мужской', id: 0 },
  { name: 'Женский', id: 1 }
]

export const BookingStatus: Record<string, string> = {
  RefundRequested: 'Запрошен возврат',
  RefundApproved: 'Возврат одобрен',
  RefundRejected: 'Возврат отклонен',
  Reserved: 'Ожидает оплаты',
  ReserveCancelled: 'Резерв отменен',
  Confirmed: 'В пути к месту назначения',
  Completed: 'Завершен'
}

export const BookingStatusColor: Record<string, string> = {
  'Запрошен возврат': '#D9534F', // Темно-красный
  'Возврат одобрен': '#A6A6A6', // Серый
  'Возврат отклонен': '#E6B800', // Темно-желтый
  'Ожидает оплаты': '#5BC0DE', // Голубой
  'Резерв отменен': '#D9534F', // Темно-красный
  'В пути к месту назначения': '#5CB85C', // Зеленый
  Завершен: '#5CB85C', // Зеленый
  'Рейс отменен': '#D9534F', // Темно-красный
  'Рейс запланирован': '#F0AD4E', // Оранжевый
  'В пути к месту отправления': '#5BC0DE', // Голубой
  'Рейс завершен': '#5CB85C' // Зеленый
}
