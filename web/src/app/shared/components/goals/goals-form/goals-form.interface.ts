import type { GoalType } from '@core/api/goals.interface'

export interface iGoalsData {
	id?: string
	accountId?: string
	title?: string
	amount?: number
	currentAmount?: number
	type?: GoalType
	startDate?: string
	endDate?: string
	createdAt?: string
}
