import { Component, computed, inject } from '@angular/core'
import { StatisticsService } from '@core/services/statistics.service'
import { LucideAngularModule, TrendingDownIcon } from 'lucide-angular'
import { CATEGORY_ICON_MAP } from '../../categories/category-icons'
import { ZardCardComponent } from '../../ui/card'
import { ZardProgressBarComponent } from '../../ui/progress-bar'

const ROW_STYLES = [
	{
		bg: 'bg-income-foreground/20 text-income-foreground',
		zType: 'income' as const,
	},
	{
		bg: 'bg-balance-foreground/20 text-balance-foreground',
		zType: 'balance' as const,
	},
	{
		bg: 'bg-expense-foreground/20 text-expense-foreground',
		zType: 'expense' as const,
	},
]

@Component({
	selector: 'app-statistics-breakdown',
	imports: [ZardCardComponent, ZardProgressBarComponent, LucideAngularModule],
	templateUrl: './statistics-breakdown.html',
})
export class StatisticsBreakdown {
	private readonly statisticsService = inject(StatisticsService)

	readonly iconMap = CATEGORY_ICON_MAP
	readonly TrendingDownIcon = TrendingDownIcon

	readonly topCategories = computed(() =>
		this.statisticsService.expenseCategories().slice(0, 3),
	)

	getRowStyle(index: number) {
		return ROW_STYLES[index] ?? ROW_STYLES[0]
	}

	formatAmount(value: number): string {
		return new Intl.NumberFormat('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}
}
