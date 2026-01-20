import { Injectable } from '@nestjs/common'

@Injectable()
export class SavingsService {
	calculateSavingsBreakdown(amount: number, deadline: Date) {
		const now = new Date()
		const daysLeft = Math.ceil(
			(deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		)
		const weeksLeft = Math.ceil(daysLeft / 7)
		const monthsLeft = Math.ceil(daysLeft / 30)

		return {
			daily: Number((amount / daysLeft).toFixed(2)),
			weekly: Number((amount / weeksLeft).toFixed(2)),
			monthly: Number((amount / monthsLeft).toFixed(2)),
			daysRemaining: daysLeft,
		}
	}
}
