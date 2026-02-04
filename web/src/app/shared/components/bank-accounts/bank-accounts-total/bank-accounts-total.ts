import { Component } from '@angular/core'
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
}
