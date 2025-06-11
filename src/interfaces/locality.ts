import type { IBaseObject } from '@/utils/baseObject'

export interface ILocality extends IBaseObject {
  name: string
  region: string
  country: string
  district: string
  timezone: string
  offsetMinutes: number
}
