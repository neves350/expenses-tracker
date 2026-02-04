import { Component, inject, type OnInit } from '@angular/core'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import {
	ArrowRightLeftIcon,
	CoinsIcon,
	LucideAngularModule,
	PlusIcon,
} from 'lucide-angular'
import { BankAccountsForm } from '@/shared/components/bank-accounts/bank-accounts-form/bank-accounts-form'
import { BankAccountsList } from '@/shared/components/bank-accounts/bank-accounts-list/bank-accounts-list'
import { BankAccountsTotal } from '@/shared/components/bank-accounts/bank-accounts-total/bank-accounts-total'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-bank-account',
	imports: [
		LucideAngularModule,
		ZardButtonComponent,
		ZardCardComponent,
		BankAccountsList,
		BankAccountsTotal,
	],
	templateUrl: './bank-account.html',
})
export class BankAccount implements OnInit {
	readonly CoinsIcon = CoinsIcon
	readonly PlusIcon = PlusIcon
	readonly ArrowRightLeftIcon = ArrowRightLeftIcon

	private readonly sheetService = inject(ZardSheetService)
	private readonly bankAccountsService = inject(BankAccountsService)

	// Expose service signals to template
	readonly accounts = this.bankAccountsService.bankAccounts
	readonly loading = this.bankAccountsService.loading
	readonly hasBankAccounts = this.bankAccountsService.hasBankAccounts

	ngOnInit(): void {
		this.bankAccountsService.loadBankAccounts().subscribe()
	}

	openSheet() {
		this.sheetService.create({
			zTitle: 'New Bank Account',
			zContent: BankAccountsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: true,
		})
	}
}
