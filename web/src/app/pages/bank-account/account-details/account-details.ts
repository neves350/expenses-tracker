import { Component, input } from '@angular/core'
import { BankAccount } from '@core/api/bank-accounts.interface'
import { AccountBalance } from '@/shared/components/accounts/accounts-details/account-balance/account-balance'
import { AccountBalanceChart } from '@/shared/components/accounts/accounts-details/account-balance-chart/account-balance-chart'
import { AccountRecent } from '@/shared/components/accounts/accounts-details/account-recent/account-recent'
import AccountHeader from '../../../shared/components/accounts/accounts-details/account-header/account-header'

@Component({
	selector: 'app-account-details',
	imports: [AccountBalance, AccountBalanceChart, AccountRecent, AccountHeader],
	templateUrl: './account-details.html',
})
export class AccountDetails {
	readonly account = input.required<BankAccount>()
}
