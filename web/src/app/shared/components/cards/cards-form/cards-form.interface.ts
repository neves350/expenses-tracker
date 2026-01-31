enum CardColor {
	GRAY = 'GRAY',
	RED = 'RED',
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	PURPLE = 'PURPLE',
	ORANGE = 'ORANGE',
	YELLOW = 'YELLOW',
	PINK = 'PINK',
}

enum CurrencyType {
	EUR = 'EUR',
	USD = 'USD',
}

enum CardType {
	CASH = 'CASH',
	BANK_ACCOUNT = 'BANK_ACCOUNT',
	CREDIT_CARD = 'CREDIT_CARD',
	DIGITAL_WALLET = 'DIGITAL_WALLET',
	INVESTMENT = 'INVESTMENT',
}

export interface iSheetData {
	name: string
	color: CardColor
	type: CardType
	lastFour?: string
	currency: CurrencyType
	balance: number
}
