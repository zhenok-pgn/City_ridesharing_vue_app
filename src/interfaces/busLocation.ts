export interface IBusLocation {
  latitude: number
  longitude: number
  timestamp: string // ISO 8601 format
  tripId: string
}

export interface ITripEta {
  tripId: string // Идентификатор рейса
  currentTime: string // Текущее время (с сервера)
  stopEtas: IStopEta[] // Список остановок
}

export interface IStopEta {
  stopId: string // Идентификатор остановки
  stopName: string // Название остановки
  latitude: number // Широта остановки
  longitude: number // Долгота остановки
  timezoneOffset: number // Смещение часового пояса в секундах
  estimatedArrival: string // Ожидаемое прибытие
  delay?: string // Задержка, если есть
}
