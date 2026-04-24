export type UserRole = 'Admin' | 'Buyer' | 'Seller'
export type AuthStatus = 'anonymous' | 'authenticated'

export type AuctionStatus = 'Draft' | 'Live' | 'Closed' | 'Cancelled'

export type Auction = {
  eventId: string
  createdBySellerId: string
  rfqName: string
  startTime: string
  bidCloseTime: string
  forcedCloseTime: string
  status: AuctionStatus
}

export type Bid = {
  bidId: string
  eventId: string
  buyerId: string
  amount: number
  timestamp: string
}

