export type MovementType = 'transfer' | 'income' | 'expense'

export interface Movement {
	id: string
	type: MovementType
	label: string
	subtitle: string
	amount: string
	date: Date
}
