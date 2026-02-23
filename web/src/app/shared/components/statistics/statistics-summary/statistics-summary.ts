import { DecimalPipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { StatisticsService } from '@core/services/statistics.service'
import {
	ArrowDownIcon,
	ArrowUpIcon,
	BanknoteArrowDownIcon,
	BanknoteArrowUpIcon,
	LucideAngularModule,
	MoveUpRightIcon,
	WalletIcon,
} from 'lucide-angular'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardCardComponent } from '../../ui/card'

@Component({
	selector: 'app-statistics-summary',
	imports: [
		LucideAngularModule,
		ZardCardComponent,
		DecimalPipe,
		ZardBadgeComponent,
	],
	templateUrl: './statistics-summary.html',
})
export class StatisticsSummary {
	private readonly statisticsService = inject(StatisticsService)

	/**
	 * INCOME
	 */
	readonly totalIncome = computed(
		() => this.statisticsService.overview()?.totalIncome ?? 0,
	)
	readonly incomeChange = computed(() => {
		const change = this.statisticsService.trends()?.change.income
		return change ? Number.parseFloat(change) : 0
	})
	readonly incomePositive = computed(() => this.incomeChange() >= 0)

	/**
	 * EXPENSES
	 */
	readonly totalExpenses = computed(
		() => this.statisticsService.overview()?.totalExpenses ?? 0,
	)
	readonly expensesChange = computed(() => {
		const change = this.statisticsService.trends()?.change.expenses
		return change ? Number.parseFloat(change) : 0
	})
	readonly expensesPositive = computed(() => this.expensesChange() >= 0)

	/**
	 * NET BALANCE
	 */
	readonly totalBalance = computed(
		() => this.statisticsService.overview()?.balance ?? 0,
	)
	readonly balanceChange = computed(() => {
		const change = this.statisticsService.trends()?.change.balance
		return change ? Number.parseFloat(change) : 0
	})
	readonly balancePositive = computed(() => this.balanceChange() >= 0)

	readonly periodLabel = this.statisticsService.periodLabel

	readonly ArrowUpIcon = ArrowUpIcon
	readonly ArrowDownIcon = ArrowDownIcon
	readonly MoveUpRightIcon = MoveUpRightIcon
	readonly BanknoteArrowUpIcon = BanknoteArrowUpIcon
	readonly BanknoteArrowDownIcon = BanknoteArrowDownIcon
	readonly WalletIcon = WalletIcon
}
