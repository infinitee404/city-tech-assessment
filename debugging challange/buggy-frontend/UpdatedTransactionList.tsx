import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { transactionService } from '../services/transactionService'
import { Transaction } from '../types/transaction'

interface TransactionListProps {
	merchantId: string
	refreshInterval?: number
}

export const TransactionList: React.FC<TransactionListProps> = ({ merchantId, refreshInterval = 5000 }) => {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true) // Track if data is loading
	const [error, setError] = useState<string | null>(null) // Track errors

	// FIX 1: Memoized the currency formatter to avoid creating it on every render
	const currencyFormatter = useMemo(
		() =>
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}),
		[]
	) // This will only run once

	// FIX 2: Used `useCallback` to memoize the formatAmount function
	const formatAmount = useCallback((amount: number) => currencyFormatter.format(amount), [currencyFormatter])

	// FIX 3: Added error handling to the API call
	const fetchData = useCallback(async () => {
		try {
			setError(null) // Reset error state before making the request
			setLoading(true) // Set loading to true before fetching
			const data = await transactionService.getTransactions({
				merchantId,
				page: 1,
				size: 100,
			})
			setTransactions(data.content) // Update transactions state with fetched data
		} catch (err) {
			console.error('Failed to fetch transactions:', err)
			setError(err instanceof Error ? err.message : 'Failed to fetch transactions') // Set error message
		} finally {
			setLoading(false) // Set loading to false after fetching
		}
	}, [merchantId])

	// FIX 4: Proper cleanup of interval, and refreshInterval added to dependencies
	useEffect(() => {
		fetchData() // Initial data fetch
		const interval = setInterval(fetchData, refreshInterval) // Set up interval to refresh data
		return () => {
			clearInterval(interval) // Clean up the interval when the component unmounts or dependencies change
		}
	}, [merchantId, refreshInterval, fetchData]) // Refresh interval and merchantId are now in the deps array

	// FIX 5: Derived filtered transactions using useMemo to avoid unnecessary state and re-renders
	const filteredTransactions = useMemo(() => {
		if (!searchTerm) return transactions // If no search term, return all transactions
		const lowerSearch = searchTerm.toLowerCase()
		return transactions.filter(
			(txn) => txn.merchantName.toLowerCase().includes(lowerSearch) || txn.transactionId.toLowerCase().includes(lowerSearch)
		)
	}, [searchTerm, transactions]) // Recalculate when transactions or searchTerm changes

	// FIX 6: Show loading spinner if data is still loading
	if (loading && transactions.length === 0) {
		return <div>Loading...</div> // Simple loading indicator
	}

	// FIX 7: Handle error state and display error message
	if (error) {
		return (
			<div>
				<p>Error: {error}</p>
				<button onClick={fetchData}>Retry</button> {/* Button to retry the fetch */}
			</div>
		)
	}

	return (
		<div>
			<input
				type='text'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder='Search transactions...'
			/>

			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Merchant</th>
						<th>Amount</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredTransactions.map((txn) => (
						<tr key={txn.transactionId}>
							<td>{txn.transactionId}</td>
							<td>{txn.merchantName}</td>
							<td>{formatAmount(txn.totalAmount)}</td>
							<td>{txn.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
