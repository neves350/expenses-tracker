import { Component, inject } from '@angular/core'
import type { StatisticsQueryParams } from '@core/api/statistics.interface'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { StatisticsService } from '@core/services/statistics.service'
import { ChartPieIcon, LucideAngularModule } from 'lucide-angular'
import { StatisticsCategories } from '@/shared/components/statistics/statistics-categories/statistics-categories'
import { StatisticsFilter } from '@/shared/components/statistics/statistics-filter/statistics-filter'
import { StatisticsSummary } from '@/shared/components/statistics/statistics-summary/statistics-summary'
import { ZardCardComponent } from '@/shared/components/ui/card'

@Component({
	selector: 'app-statistics',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		StatisticsFilter,
		StatisticsSummary,
		StatisticsCategories,
	],
	templateUrl: './statistics.html',
})
export class Statistics {
	private readonly bankAccountsService = inject(BankAccountsService)
	private readonly statisticsService = inject(StatisticsService)

	readonly accounts = this.bankAccountsService.bankAccounts
	readonly hasData = this.statisticsService.hasData
	readonly ChartPieIcon = ChartPieIcon

	constructor() {
		this.bankAccountsService.loadBankAccounts().subscribe()
		this.statisticsService
			.loadStatistics({ period: this.statisticsService.period() })
			.subscribe()
	}

	onFilterChange(params: StatisticsQueryParams) {
		this.statisticsService.loadStatistics(params).subscribe()
	}
}
