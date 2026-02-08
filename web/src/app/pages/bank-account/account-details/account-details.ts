import { Component, input } from '@angular/core'
import { BankAccount } from '@core/api/bank-accounts.interface'
import { AccountBalance } from '@/shared/components/accounts/accounts-details/account-balance/account-balance'
import AccountHeader from '../../../shared/components/accounts/accounts-details/account-header/account-header'

@Component({
	selector: 'app-account-details',
	imports: [AccountHeader, AccountBalance],
	templateUrl: './account-details.html',
})
export class AccountDetails {
	readonly account = input.required<BankAccount>()
}
