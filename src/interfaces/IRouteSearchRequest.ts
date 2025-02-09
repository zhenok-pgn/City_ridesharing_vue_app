import type { ISelectedAddress } from './ISelectedAddress'

export interface IRouteSearchRequest {
  from: ISelectedAddress
  to: ISelectedAddress
  passangersCount: number
  date: string
}
