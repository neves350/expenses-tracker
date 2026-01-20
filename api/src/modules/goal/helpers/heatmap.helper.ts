import { Injectable } from '@nestjs/common'
import type { HeatmapDay } from '../interfaces/heatmap-day.interface'

@Injectable()
export class HeatmapService {
	generateHeatmap(deposits: any[], deadline: Date): HeatmapDay[] {
		const now = new Date()
		const startDate = new Date(now)
		const endDate = new Date(deadline)

		const depositMap = new Map<string, number>()
		deposits.forEach((deposit) => {
			const dateKey = deposit.createdAt.toISOString().split('T')[0]
			const amount = Number(deposit.amount)
			depositMap.set(dateKey, (depositMap.get(dateKey) || 0) + amount)
		})

		const days: HeatmapDay[] = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			const dateKey = currentDate.toISOString().split('T')[0]
			days.push({
				date: dateKey,
				amount: depositMap.get(dateKey) || 0,
				hasDeposit: depositMap.has(dateKey),
			})
			currentDate.setDate(currentDate.getDate() + 1)
		}

		return days
	}
}
