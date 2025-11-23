import { useState, useEffect } from 'react'
import './EditMerchantModal.css'
import { updateMerchant } from '@/services/merchantService'
import { Merchant } from '@/types/merchant'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface EditMerchantModalProps {
	onClose: () => void
	onEditSuccess: () => void
	merchant: Merchant
}

const EditMerchantModal: React.FC<EditMerchantModalProps> = ({ onClose, onEditSuccess, merchant }) => {
	const [form, setForm] = useState<Merchant>(merchant)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [apiError, setApiError] = useState<string | null>(null)

	useEffect(() => {
		setForm(merchant) // Pre-fill form with current merchant data
	}, [merchant])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!form.name) newErrors.name = 'Merchant Name is required'
		if (!form.email) {
			newErrors.email = 'Email is required'
		} else if (!/\S+@\S+\.\S+/.test(form.email)) {
			newErrors.email = 'Email is invalid'
		}
		if (!form.phone) newErrors.phone = 'Phone Number is required'
		if (!form.category) newErrors.category = 'Category is required'
		if (!form.address) newErrors.address = 'Address is required'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value })
		if (errors[e.target.name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors }
				delete newErrors[e.target.name]
				return newErrors
			})
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setApiError(null)
		if (!validateForm()) {
			return
		}

		setLoading(true)
		try {
			await updateMerchant(form.id, form) // Call API
			onEditSuccess() // Refresh list and close modal
		} catch (err) {
			setApiError('Failed to update merchant. Please try again.')
			console.error('Error updating merchant:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='modal-overlay'>
			<div className='modal-box'>
				<h2>Edit Merchant</h2>
				{apiError && <div className='api-error-message'>{apiError}</div>}
				{loading ? (
					<LoadingSpinner />
				) : (
					<form onSubmit={handleSubmit}>
						<Input
							label='Merchant ID'
							name='id'
							value={form.id}
							disabled
						/>
						<Input
							label='Merchant Name'
							name='name'
							value={form.name}
							onChange={handleChange}
							error={errors.name}
						/>

						<Input
							label='Email'
							name='email'
							type='email'
							value={form.email}
							onChange={handleChange}
							error={errors.email}
						/>

						<Input
							label='Phone No.'
							name='phone'
							value={form.phone}
							onChange={handleChange}
							error={errors.phone}
						/>

						<Input
							label='Category'
							name='category'
							value={form.category}
							onChange={handleChange}
							error={errors.category}
						/>

						<Input
							label='Address'
							name='address'
							value={form.address}
							onChange={handleChange}
							error={errors.address}
						/>

						<label>Status</label>
						<select
							name='status'
							value={form.status}
							onChange={handleChange}
							className={`select-input ${errors.status ? 'input-error' : ''}`}
						>
							<option value='Active'>Active</option>
							<option value='Inactive'>Inactive</option>
							<option value='Pending'>Pending</option>
						</select>
						{errors.status && <span className='input-error-message'>{errors.status}</span>}

						<div className='modal-actions'>
							<Button type='submit'>Save Changes</Button>
							<Button
								type='button'
								variant='secondary'
								onClick={onClose}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default EditMerchantModal
