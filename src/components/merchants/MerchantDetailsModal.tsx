import { useState, useEffect, useCallback } from 'react'
import './MerchantDetailsModal.css'
import { getMerchantById } from '@/services/merchantService'
import { Merchant } from '@/types/merchant'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface MerchantDetailsModalProps {
	merchantId: string
	onClose: () => void
}

const MerchantDetailsModal: React.FC<MerchantDetailsModalProps> = ({ merchantId, onClose }) => {
	const [merchant, setMerchant] = useState<Merchant | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchMerchant = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await getMerchantById(merchantId)
			setMerchant(data)
		} catch (err) {
			setError('Failed to fetch merchant details.')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, [merchantId])

	useEffect(() => {
		fetchMerchant()
	}, [fetchMerchant])

	return (
		<div className='modal-overlay'>
			<div className='modal-box'>
				<h2>Merchant Details</h2>
				{loading ? (
					<LoadingSpinner />
				) : error ? (
					<div className='api-error-message'>{error}</div>
				) : merchant ? (
					<div className='merchant-details-content'>
						<div className='detail-item'>
							<strong>ID:</strong> {merchant.id}
						</div>
						<div className='detail-item'>
							<strong>Name:</strong> {merchant.name}
						</div>
						<div className='detail-item'>
							<strong>Email:</strong> {merchant.email}
						</div>
						<div className='detail-item'>
							<strong>Phone:</strong> {merchant.phone}
						</div>
						<div className='detail-item'>
							<strong>Status:</strong> {merchant.status}
						</div>
						<div className='detail-item'>
							<strong>Category:</strong> {merchant.category}
						</div>
						<div className='detail-item'>
							<strong>Address:</strong> {merchant.address}
						</div>
					</div>
				) : null}
				<div className='modal-actions'>
					<Button
						type='button'
						variant='secondary'
						onClick={onClose}
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}

export default MerchantDetailsModal
