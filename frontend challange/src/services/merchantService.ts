import { get, post, put } from './api'
import { Merchant } from '@/types/merchant'
import { Transaction } from '@/types/transaction'

export type { Merchant, Transaction }

const MERCHANT_BASE_URL = '/merchants'

export interface MerchantStats {
	totalTransactions: number
	totalVolume: number
	averageTransactionValue: number
}

export interface MerchantTransactionsResponse {
	data: Transaction[]
	total: number
	page: number
	limit: number
}

export const getMerchants = (params: { sort?: string; search?: string } = {}) => {
	return get<Merchant[]>(MERCHANT_BASE_URL, { params })
}

export const getMerchantById = (id: string) => {
	return get<Merchant>(`${MERCHANT_BASE_URL}/${id}`)
}

export const createMerchant = (merchant: Omit<Merchant, 'id'>) => {
	return post<Merchant>(MERCHANT_BASE_URL, merchant)
}

export const updateMerchant = (id: string, merchant: Partial<Merchant>) => {
	return put<Merchant>(`${MERCHANT_BASE_URL}/${id}`, merchant)
}

export const getMerchantStats = (id: string) => {
	return get<MerchantStats>(`${MERCHANT_BASE_URL}/${id}/stats`)
}

export const getMerchantTransactions = (id:string) => {
	return get<MerchantTransactionsResponse>(`${MERCHANT_BASE_URL}/${id}/transactions`)
}

