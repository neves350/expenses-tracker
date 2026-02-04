import type { BankCurrency, BankType } from '@core/api/bank-accounts.interface'

export interface iSheetData {
	id?: string
	name?: string
	type?: BankType
	currency?: BankCurrency
	balance?: number
	createdAt?: string
}
