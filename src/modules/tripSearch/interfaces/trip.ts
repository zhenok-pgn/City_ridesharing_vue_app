import type { IRouteSegmentSchedule, IRouteSummary } from '@/interfaces/route'
import type { IBus, IDriver } from '@/interfaces/transport'
import type { IBaseObject } from '@/utils/baseObject'

interface Seat {
  id: string
  seatNumber: string
  isAvailable: boolean
}

export interface ITrip extends IBaseObject {
  departureDate: string
  schedule: IRouteSegmentSchedule
  route: IRouteSummary
  bus: IBus
  driver: IDriver
  tripStatus: string
  seats: Seat[]
}

export const TripStatus: Record<string, string> = {
  Cancelled: 'Рейс отменен',
  Scheduled: 'Рейс запланирован',
  InProgress: 'В пути к месту отправления',
  Finished: 'Рейс завершен'
}
