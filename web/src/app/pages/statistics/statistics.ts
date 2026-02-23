import { Component, inject } from '@angular/core'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { ChartPieIcon, LucideAngularModule } from 'lucide-angular'
import { StatisticsFilter } from '@/shared/components/statistics/statistics-filter/statistics-filter'
import { ZardCardComponent } from '@/shared/components/ui/card'

@Component({
	selector: 'app-statistics',
	imports: [ZardCardComponent, LucideAngularModule, StatisticsFilter],
	templateUrl: './statistics.html',
})
export class Statistics {
	private readonly bankAccountsService = inject(BankAccountsService)

	readonly accounts = this.bankAccountsService.bankAccounts
	readonly ChartPieIcon = ChartPieIcon

	constructor() {
		this.bankAccountsService.loadBankAccounts().subscribe()
	}
}
