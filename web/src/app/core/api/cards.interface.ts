/**
 * ENUMS
 */
export enum CardColor {
	GRAY = 'GRAY',
	PURPLE = 'PURPLE',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
	YELLOW = 'YELLOW',
	ORANGE = 'ORANGE',
	RED = 'RED',
	PINK = 'PINK',
}

export enum CardType {
	CREDIT_CARD = 'CREDIT_CARD',
	DEBIT_CARD = 'DEBIT_CARD',
}

/**
 * CARD
 */
export interface Card {
	id?: string
	name: string
	color: CardColor
	type: CardType
	lastFour?: string
	creditLimit?: number
	closingDay?: number
	dueDay?: number
	createdAt?: string
}

/**
 * CREATE CARD
 */
export interface CreateCardRequest {
	name: string
	color: CardColor
	type: CardType
	lastFour?: string
	creditLimit?: number
	closingDay?: number
	dueDay?: number
}

/**
 * UPDATE CARD
 */
export interface UpdateCardRequest {
	name?: string
	color?: CardColor
	type?: CardType
	lastFour?: string
	creditLimit?: number
	closingDay?: number
	dueDay?: number
}

/**
 * CREATE RESPONSE
 */
export interface CreateCardResponse {
	card: Card
	message: string
}

/**
 * GENERIC RESPONSE
 */
export interface CardActionResponse {
	message: string
	success: boolean
}

/**
 * CARD EXPENSES
 */
export interface CardExpensesRequest {
	startDate: string
	endDate: string
}
