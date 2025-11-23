export interface Transaction {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  date: string; // ISO date string
  description?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface FilterState {
  page: number;
  size: number;
  startDate?: string;
  endDate?: string;
  status?: 'success' | 'failed' | 'pending';
}

export const DEFAULT_FILTERS: FilterState = {
  page: 1,
  size: 10,
};