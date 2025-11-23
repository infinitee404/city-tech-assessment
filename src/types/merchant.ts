export interface Merchant {
	id: string
	name: string
	category: string
	address: string
	status: 'Active' | 'Inactive' | 'Pending'
	email: string
	phone: string
}
