import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from './apiClient'
import type { Bid } from './types'

export async function listBids(eventId: string) {
  const { data } = await apiClient.get<Bid[]>(`/bids`, { params: { eventId } })
  return data
}

export async function placeBid(input: { eventId: string; amount: number }) {
  const { data } = await apiClient.post<Bid>('/bids', input)
  return data
}

export function useBids(eventId: string) {
  return useQuery({
    queryKey: ['bids', eventId],
    queryFn: () => listBids(eventId),
    enabled: !!eventId,
    refetchInterval: 5_000,
  })
}

export function usePlaceBid() {
  return useMutation({ mutationFn: placeBid })
}

