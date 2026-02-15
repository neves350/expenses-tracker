import type { TransactionType } from '@core/api/transactions.interface'

export interface iTransactionData {
	id?: string
	title?: string
	type?: TransactionType
	amount?: number
	date?: Date
	cardId?: string
	categoryId?: string
	isPaid?: boolean
}
