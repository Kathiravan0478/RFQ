import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export type CreateAuctionInput = {
  rfqName: string
  description?: string
  startTime: string
  bidCloseTime: string
  forcedCloseTime: string
  triggerWindow?: number
  extensionDuration?: number
}

export async function createAuction(body: CreateAuctionInput) {
  const { data } = await apiClient.post<Auction>('/auctions', body)
  return data
}

export async function approveAuction(eventId: string) {
  const { data } = await apiClient.put<Auction>(`/auctions/${encodeURIComponent(eventId)}/approve`)
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

export function useCreateAuction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAuction,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['auctions'] })
    },
  })
}

export function useApproveAuction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: approveAuction,
    onSuccess: (_data, eventId) => {
      void qc.invalidateQueries({ queryKey: ['auctions'] })
      void qc.invalidateQueries({ queryKey: ['auctions', eventId] })
    },
  })
}

