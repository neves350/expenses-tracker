/**
 * ENUMS
 */
export enum BankType {
	WALLET = 'WALLET',
	CHECKING = 'CHECKING',
	SAVINGS = 'SAVINGS',
	INVESTMENT = 'INVESTMENT',
}

export enum BankCurrency {
	EUR = 'EUR',
	USD = 'USD',
}

/**
 * BANK ACCOUNT
 */
export interface BankAccount {
	id?: string
	name: string
	type: BankType
	currency: BankCurrency
	balance: number
	initialBalance?: number
	totalMovements?: number
	createdAt?: string
}

/**
 * CREATE BANK ACCOUNT
 */
export interface CreateBankAccountRequest {
	name: string
	type: BankType
	currency: BankCurrency
	balance: number
}

/**
 * UPDATE BANK ACCOUNT
 */
export interface UpdateBankAccountRequest {
	name?: string
	type?: BankType
	currency?: BankCurrency
	balance?: number
}

/**
 * CREATE RESPONSE
 */
export interface CreateBankAccountResponse {
	bankAccount: BankAccount
	message: string
}

/**
 * GENERIC RESPONSE
 */
export interface BankAccountActionResponse {
	message: string
	success: boolean
}

export interface BankAccountsResponse {
	data: BankAccount[]
	total: number
	count: number
}
