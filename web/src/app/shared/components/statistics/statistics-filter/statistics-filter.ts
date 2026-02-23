import { Component, inject } from '@angular/core'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'

@Component({
	selector: 'app-statistics-filter',
	imports: [ZardSelectItemComponent, ZardSelectComponent],
	templateUrl: './statistics-filter.html',
})
export class StatisticsFilter {
	private readonly bankAccountsService = inject(BankAccountsService)

	readonly accounts = this.bankAccountsService.bankAccounts

	constructor() {
		this.bankAccountsService.loadBankAccounts().subscribe()
	}
}
