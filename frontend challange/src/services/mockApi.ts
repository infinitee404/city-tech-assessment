import MockAdapter from 'axios-mock-adapter'
import apiClient from './api'
import { merchants } from '@/data/merchants'
import { Merchant } from '@/types/merchant'
import { Transaction } from '@/types/transaction'

const mock = new MockAdapter(apiClient, { delayResponse: 500 })

// Mock data
let mockMerchants: Merchant[] = [...merchants]

// GET /merchants
mock.onGet('/merchants').reply(() => {
	console.log('[Mock API] GET /merchants', mockMerchants)
	return [200, mockMerchants]
})

// GET /merchants/:id
mock.onGet(/\/merchants\/(\d+)/).reply((config) => {
	const id = config.url?.split('/')[2]
	const merchant = mockMerchants.find((m) => m.id === id)
	console.log(`[Mock API] GET /merchants/${id}`, merchant)
	return merchant ? [200, merchant] : [404]
})

// POST /merchants
mock.onPost('/merchants').reply((config) => {
	const newMerchant = JSON.parse(config.data) as Merchant
	// Simple ID generation for mock
	const maxId = Math.max(...mockMerchants.map((m) => parseInt(m.id.split('-')[1] || '0', 10)), 0)
	newMerchant.id = `MCH-${String(maxId + 1).padStart(5, '0')}`
	mockMerchants.push(newMerchant)
	console.log('[Mock API] POST /merchants', newMerchant)
	return [201, newMerchant]
})

// PUT /merchants/:id
mock.onPut(/\/merchants\/(\d+)/).reply((config) => {
	const id = config.url?.split('/')[2]
	const updatedMerchant = JSON.parse(config.data) as Merchant
	const index = mockMerchants.findIndex((m) => m.id === id)
	if (index !== -1) {
		mockMerchants[index] = { ...mockMerchants[index], ...updatedMerchant }
		console.log(`[Mock API] PUT /merchants/${id}`, mockMerchants[index])
		return [200, mockMerchants[index]]
	}
	return [404]
})

// GET /merchants/:id/stats
mock.onGet(/\/merchants\/(\d+)\/stats/).reply(() => {
	const stats = {
		totalTransactions: Math.floor(Math.random() * 1000) + 100,
		totalVolume: Math.random() * 100000 + 10000,
		averageTransactionValue: Math.random() * 200 + 50,
	}
	console.log('[Mock API] GET /merchants/:id/stats', stats)
	return [200, stats]
})

// GET /merchants/:id/transactions
mock.onGet(/\/merchants\/(\d+)\/transactions/).reply((config) => {
	const id = config.url?.match(/\/merchants\/(\d+)\/transactions/)?.[1]
	const transactions: Transaction[] = Array.from({ length: 15 }, (_, i) => ({
		id: `TXN-${id}-${i + 1}`,
		merchantId: id as string,
		amount: Math.random() * 500,
		currency: 'USD',
		status: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)] as 'success' | 'failed' | 'pending',
		date: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 30).toISOString(),
	}))
	const response = {
		data: transactions,
		total: transactions.length,
		page: 1,
		limit: 15,
	}
	console.log(`[Mock API] GET /merchants/${id}/transactions`, response)
	return [200, response]
})

export default mock
