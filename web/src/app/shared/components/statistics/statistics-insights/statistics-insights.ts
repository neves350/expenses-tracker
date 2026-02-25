import { Component, computed, inject } from '@angular/core'
import { StatisticsService } from '@core/services/statistics.service'
import {
	BadgeAlertIcon,
	LightbulbIcon,
	LucideAngularModule,
	TagIcon,
	TrendingDownIcon,
} from 'lucide-angular'
import type { Insight } from '@/interfaces/insight.interface'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardCardComponent } from '../../ui/card'

@Component({
	selector: 'app-statistics-insights',
	imports: [ZardCardComponent, LucideAngularModule, ZardBadgeComponent],
	templateUrl: './statistics-insights.html',
})
export class StatisticsInsights {
	private readonly statisticsService = inject(StatisticsService)

	readonly LightbulbIcon = LightbulbIcon

	readonly insights = computed<Insight[]>(() => {
		const result: Insight[] = []
		const overview = this.statisticsService.overview()
		const expenses = this.statisticsService.expenseCategories()

		if (!overview) return result

		// cost alert (single category > 50% of expenses)
		for (const category of expenses) {
			if (category.percentage > 50) {
				result.push({
					icon: BadgeAlertIcon,
					badge: { label: 'Cost Alert', type: 'destructive' },
					message: `${category.categoryTitle} represents ${category.percentage}% of your expenses (${this.fmt(category.total)})`,
					border: 'border-expense-foreground/30',
					bg: 'bg-expense-foreground/5',
				})
			}
		}

		// category concentration: top category between 40-50%
		const top = expenses[0]
		if (top && top.percentage > 40 && top.percentage <= 50) {
			result.push({
				icon: TagIcon,
				badge: { label: 'Category', type: 'warning' },
				message: `${top.categoryTitle} represents ${top.percentage}% of your total expenses`,
				border: 'border-goal-foreground/30',
				bg: 'bg-goal-foreground/5',
			})
		}

		// spending > income
		if (
			overview.totalExpenses > overview.totalIncome &&
			overview.totalIncome > 0
		) {
			result.push({
				icon: TrendingDownIcon,
				badge: { label: 'Spending', type: 'destructive' },
				message: `You spent more than you earned this period (${this.fmt(overview.totalExpenses)} vs ${this.fmt(overview.totalIncome)})`,
				border: 'border-expense-foreground/30',
				bg: 'bg-expense-foreground/5',
			})
		}

		// low diversity: all expenses in 1 category
		if (expenses.length === 1) {
			result.push({
				icon: TagIcon,
				badge: { label: 'Category', type: 'warning' },
				message: `All your expenses are in a single category: ${expenses[0].categoryTitle}`,
				border: 'border-goal-foreground/30',
				bg: 'bg-goal-foreground/5',
			})
		}

		// good savings: expenses <= 50% of income
		if (
			overview.totalIncome > 0 &&
			overview.totalExpenses <= overview.totalIncome * 0.5
		) {
			result.push({
				icon: LightbulbIcon,
				badge: { label: 'Tip', type: 'success' },
				message: `You're saving more than 50% of your income this period`,
				border: 'border-income-foreground/30',
				bg: 'bg-income-foreground/5',
			})
		}

		return result
	})

	private fmt(value: number): string {
		return `${new Intl.NumberFormat('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)}€`
	}
}
