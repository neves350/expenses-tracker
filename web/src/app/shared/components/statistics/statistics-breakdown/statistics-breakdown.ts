import { Component, computed, inject, signal } from '@angular/core'
import { StatisticsService } from '@core/services/statistics.service'
import { LucideAngularModule, TrendingDownIcon } from 'lucide-angular'
import { CATEGORY_ICON_MAP } from '../../categories/category-icons'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardCardComponent } from '../../ui/card'
import { ZardProgressBarComponent } from '../../ui/progress-bar'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'

const ROW_STYLES = [
	{
		bg: 'bg-income-foreground/20 text-income-foreground',
		zType: 'income' as const,
		badge: 'positive' as const,
	},
	{
		bg: 'bg-balance-foreground/20 text-balance-foreground',
		zType: 'balance' as const,
		badge: 'balance' as const,
	},
	{
		bg: 'bg-expense-foreground/20 text-expense-foreground',
		zType: 'expense' as const,
		badge: 'negative' as const,
	},
]

@Component({
	selector: 'app-statistics-breakdown',
	imports: [
		ZardCardComponent,
		ZardBadgeComponent,
		ZardProgressBarComponent,
		LucideAngularModule,
		ZardSelectComponent,
		ZardSelectItemComponent,
	],
	templateUrl: './statistics-breakdown.html',
})
export class StatisticsBreakdown {
	private readonly statisticsService = inject(StatisticsService)

	readonly selectedType = signal<'EXPENSE' | 'INCOME'>('EXPENSE')
	readonly iconMap = CATEGORY_ICON_MAP
	readonly TrendingDownIcon = TrendingDownIcon

	readonly title = computed(() =>
		this.selectedType() === 'EXPENSE'
			? 'Expenses by category'
			: 'Income by category',
	)

	readonly topCategories = computed(() => {
		const categories =
			this.selectedType() === 'EXPENSE'
				? this.statisticsService.expenseCategories()
				: this.statisticsService.incomeCategories()
		return categories.slice(0, 3)
	})

	getRowStyle(index: number) {
		return ROW_STYLES[index] ?? ROW_STYLES[0]
	}

	formatAmount(value: number): string {
		return new Intl.NumberFormat('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	onTypeChange(value: string | string[]): void {
		const val = Array.isArray(value) ? value[0] : value
		this.selectedType.set(val as 'EXPENSE' | 'INCOME')
	}
}
