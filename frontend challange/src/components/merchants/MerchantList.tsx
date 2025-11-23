import { useState, useEffect, useMemo, useCallback } from 'react'
import { Table } from '@/components/common/Table'
import { Button } from '../common/Button'
import AddMerchantModal from './AddMerchantModal'
import EditMerchantModal from './EditMerchantModal'
import MerchantDetailsModal from './MerchantDetailsModal'
import './MerchantList.css'
import { getMerchants } from '@/services/merchantService'
import { Merchant } from '@/types/merchant'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { Input } from '../common/Input'

type SortDirection = 'asc' | 'desc'

const MerchantList = () => {
	const [merchants, setMerchants] = useState<Merchant[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [sortColumn, setSortColumn] = useState<keyof Merchant>('name')
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
	const [showDetailsModal, setShowDetailsModal] = useState(false)
	const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null)
	const rowsPerPage = 10

	const fetchMerchants = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			// In a real app, search, filter, sort, and pagination would be API parameters
			const data = await getMerchants()
			setMerchants(data)
		} catch (err) {
			setError('Failed to fetch merchants.')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchMerchants()
	}, [fetchMerchants])

	const handleSort = useCallback(
		(columnKey: keyof Merchant) => {
			if (sortColumn === columnKey) {
				setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
			} else {
				setSortColumn(columnKey)
				setSortDirection('asc')
			}
		},
		[sortColumn, sortDirection]
	)

	const handleIdClick = (merchantId: string) => {
		setSelectedMerchantId(merchantId)
		setShowDetailsModal(true)
	}

	const filteredAndSortedMerchants = useMemo(() => {
		let currentMerchants = [...merchants]

		// Filter
		currentMerchants = currentMerchants.filter((m) => {
			const matchesSearch =
				m.id.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase())

			const matchesStatus = statusFilter === 'all' || m.status.toLowerCase() === statusFilter.toLowerCase()

			return matchesSearch && matchesStatus
		})

		// Sort
		currentMerchants.sort((a, b) => {
			const aValue = a[sortColumn]
			const bValue = b[sortColumn]

			if (aValue === undefined || bValue === undefined) return 0

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
			}
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
			}
			return 0
		})

		return currentMerchants
	}, [merchants, search, statusFilter, sortColumn, sortDirection])

	const totalPages = Math.ceil(filteredAndSortedMerchants.length / rowsPerPage)
	const indexOfLastRow = currentPage * rowsPerPage
	const indexOfFirstRow = indexOfLastRow - rowsPerPage
	const currentMerchants = filteredAndSortedMerchants.slice(indexOfFirstRow, indexOfLastRow)

	const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1)
	const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1)

	const [showAddModal, setShowAddModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)

	const handleAddMerchantSuccess = useCallback(() => {
		fetchMerchants() // Refresh the list after adding a new merchant
	}, [fetchMerchants])

	const handleEditMerchantSuccess = useCallback(() => {
		setShowEditModal(false)
		setSelectedMerchant(null)
		fetchMerchants() // Refresh the list after editing a merchant
	}, [fetchMerchants])

	const handleEditClick = useCallback((merchant: Merchant) => {
		setSelectedMerchant(merchant)
		setShowEditModal(true)
	}, [])

	const merchantTableHeaders = useMemo(
		() => [
			{ key: 'id', label: 'ID', sortable: true },
			{ key: 'name', label: 'Merchant Name', sortable: true },
			{ key: 'phone', label: 'Phone', sortable: false },
			{ key: 'email', label: 'Email', sortable: true },
			{ key: 'status', label: 'Status', sortable: true },
			{ key: 'action', label: 'Action', sortable: false }, // Action column is not sortable
		],
		[]
	)

	if (loading) {
		return (
			<main className='merchant-container'>
				<LoadingSpinner />
			</main>
		)
	}

	if (error) {
		return (
			<main className='merchant-container'>
				<div className='error-message'>{error}</div>
			</main>
		)
	}

	return (
		<main className='merchant-container'>
			<div className='merchant-header'>
				<h1 className='merchant-title'>Merchants</h1>
				<Button onClick={() => setShowAddModal(true)}>Add New Merchant</Button>
			</div>

			<div className='search-filter-row'>
				<Input
					type='text'
					placeholder='Search by ID or Merchant Name...'
					className='search-input'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value)
						setCurrentPage(1)
					}}
				/>

				<select
					className='status-dropdown'
					value={statusFilter}
					onChange={(e) => {
						setStatusFilter(e.target.value)
						setCurrentPage(1)
					}}
				>
					<option value='all'>All Status</option>
					<option value='active'>Active</option>
					<option value='inactive'>Inactive</option>
					<option value='pending'>Pending</option>
				</select>
			</div>

			<div className='table-container'>
				<Table
					headers={merchantTableHeaders}
					data={currentMerchants}
					onSort={handleSort}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
					renderRow={(merchant) => (
						<tr key={merchant.id} onClick={() => handleIdClick(merchant.id)} className="merchant-row-clickable">
							<td>
								{merchant.id}
							</td>
							<td>{merchant.name}</td>
							<td>{merchant.phone}</td>
							<td>{merchant.email}</td>
							<td>{merchant.status}</td>
							<td>
								<Button
									variant='secondary'
									size='small'
									onClick={(e) => {
										e.stopPropagation();
										handleEditClick(merchant);
									}} // Open edit modal
								>
									Edit
								</Button>
							</td>
						</tr>
					)}
				/>
			</div>

			<div className='pagination'>
				<button
					onClick={handlePrev}
					disabled={currentPage === 1}
					className='pagination-btn'
				>
					Prev
				</button>

				<span className='pagination-info'>
					Page {currentPage} of {totalPages || 1}
				</span>

				<button
					onClick={handleNext}
					disabled={currentPage === totalPages || totalPages === 0}
					className='pagination-btn'
				>
					Next
				</button>
			</div>

			{showAddModal && (
				<AddMerchantModal
					onClose={() => setShowAddModal(false)}
					onAddSuccess={handleAddMerchantSuccess}
				/>
			)}

			{showEditModal && selectedMerchant && (
				<EditMerchantModal
					onClose={() => {
						setShowEditModal(false)
						setSelectedMerchant(null)
					}}
					onEditSuccess={handleEditMerchantSuccess}
					merchant={selectedMerchant}
				/>
			)}

			{showDetailsModal && selectedMerchantId && (
				<MerchantDetailsModal
					merchantId={selectedMerchantId}
					onClose={() => {
						setShowDetailsModal(false)
						setSelectedMerchantId(null)
					}}
				/>
			)}
		</main>
	)
}

export default MerchantList
