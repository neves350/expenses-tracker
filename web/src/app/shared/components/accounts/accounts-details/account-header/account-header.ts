import { Component, computed, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BankAccount, BankType } from '@core/api/bank-accounts.interface'
import { ArrowBigLeftDashIcon, LucideAngularModule } from 'lucide-angular'
import { ZardButtonComponent } from '@/shared/components/ui/button'

@Component({
	selector: 'app-account-header',
	imports: [ZardButtonComponent, LucideAngularModule, RouterLink],
	templateUrl: './account-header.html',
})
export default class AccountHeader {
	readonly ArrowBigLeftDashIcon = ArrowBigLeftDashIcon

	readonly account = input.required<BankAccount>()

	private readonly typeLabels: Record<BankType, string> = {
		[BankType.WALLET]: 'Wallet',
		[BankType.CHECKING]: 'Checking',
		[BankType.SAVINGS]: 'Savings',
		[BankType.INVESTMENT]: 'Investment',
	}

	readonly accountType = computed(() => {
		return this.typeLabels[this.account().type]
	})
}
