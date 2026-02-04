import { Component, inject } from '@angular/core'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import {
	LucideAngularModule,
	TrendingUpIcon,
	WalletMinimalIcon,
} from 'lucide-angular'
import { ZardCardComponent } from '../../ui/card'
import { ZardDividerComponent } from '../../ui/divider'

@Component({
	selector: 'app-bank-accounts-total',
	imports: [ZardCardComponent, LucideAngularModule, ZardDividerComponent],
	templateUrl: './bank-accounts-total.html',
})
export class BankAccountsTotal {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly TrendingUpIcon = TrendingUpIcon

	private readonly bankAccountsService = inject(BankAccountsService)

	readonly totalBalance = this.bankAccountsService.totalBalance
	readonly accountCount = this.bankAccountsService.totalAccounts
}
