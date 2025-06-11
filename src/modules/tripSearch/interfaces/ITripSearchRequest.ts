import type { ILocality } from '@/interfaces/locality'
import { DateOnly } from '@/utils/dateTime'

export interface ITripSearchRequest {
  from: ILocality
  to: ILocality
  date: string
}

export const createTripSearchRequest = (): ITripSearchRequest => {
  return {
    from: {} as ILocality,
    to: {} as ILocality,
    date: new DateOnly().toString()
  }
}
