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

export enum CurrencyType {
	EUR = 'EUR',
	USD = 'USD',
}

export enum CardType {
	CASH = 'CASH',
	BANK_ACCOUNT = 'BANK_ACCOUNT',
	CREDIT_CARD = 'CREDIT_CARD',
	DIGITAL_WALLET = 'DIGITAL_WALLET',
	INVESTMENT = 'INVESTMENT',
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
	currency: CurrencyType
	balance: number
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
	currency: CurrencyType
	balance: number
}

/**
 * UPDATE CARD
 */
export interface UpdateCardRequest {
	name?: string
	color?: CardColor
	type?: CardType
	lastFour?: string
	currency?: CurrencyType
	balance?: number
}

/**
 * CREATE RESPONSE
 */
export interface CreateCardResponse {
	wallet: Card
	message: string
}

/**
 * GENERIC RESPONSE
 */
export interface CardActionResponse {
	message: string
	success: boolean
}
