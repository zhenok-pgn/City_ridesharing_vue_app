import { useAuthStore } from '@/modules/auth/stores/auth'
import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

export function useTripHub() {
  const auth = useAuthStore()

  const start = async () => {
    const token = auth.accessToken
    if (!token) throw new Error('Нет токена')

    connection = new signalR.HubConnectionBuilder()
      .withUrl('/server/hubs/trip', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build()

    connection.onclose((err) => {
      console.warn('SignalR отключён', err)
      connection = null
    })

    await connection.start()
  }

  const stop = async () => {
    if (connection) {
      await connection.stop()
      connection = null
    }
  }

  const joinTrip = async (tripId: string) => {
    await connection?.invoke('JoinTripGroup', tripId)
  }

  const leaveTrip = async (tripId: string) => {
    await connection?.invoke('LeaveTripGroup', tripId)
  }

  const onTripLocationUpdated = (handler: (data: any) => void) => {
    connection?.on('TripLocationUpdated', handler)
  }

  const onTripStatusChanged = (handler: (status: string) => void) => {
    connection?.on('TripStatusChanged', handler)
  }

  const onEtaUpdated = (handler: (eta: any) => void) => {
    connection?.on('EtaUpdated', handler)
  }

  return {
    start,
    stop,
    joinTrip,
    leaveTrip,
    onTripLocationUpdated,
    onTripStatusChanged,
    onEtaUpdated
  }
}
