import { useQuery } from '@tanstack/react-query'
import { apiClient } from './apiClient'
import type { Auction } from './types'

export async function listAuctions(params?: { status?: string }) {
  const { data } = await apiClient.get<Auction[]>('/auctions', { params })
  return data
}

export async function getAuction(eventId: string) {
  const { data } = await apiClient.get<Auction>(`/auctions/${encodeURIComponent(eventId)}`)
  return data
}

export function useAuctions(params?: { status?: string }) {
  return useQuery({
    queryKey: ['auctions', params ?? {}],
    queryFn: () => listAuctions(params),
  })
}

export function useAuction(eventId: string) {
  return useQuery({
    queryKey: ['auctions', eventId],
    queryFn: () => getAuction(eventId),
    enabled: !!eventId,
  })
}

