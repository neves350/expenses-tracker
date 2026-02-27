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
import { TransfersForm } from '@/shared/components/transfers/transfers-form/transfers-form'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardLoaderComponent } from '@/shared/components/ui/loader'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-bank-account',
	imports: [
		LucideAngularModule,
		ZardButtonComponent,
		ZardCardComponent,
		BankAccountsList,
		BankAccountsTotal,
		ZardLoaderComponent,
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
	readonly isLoading = this.bankAccountsService.loading
	readonly hasBankAccounts = this.bankAccountsService.hasBankAccounts

	ngOnInit(): void {
		this.bankAccountsService.loadBankAccounts().subscribe()
	}

	openTransfer() {
		this.sheetService.create({
			zTitle: 'New Transfer',
			zContent: TransfersForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Send Transfer',
			zOnOk: (instance: TransfersForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}

	openSheet() {
		this.sheetService.create({
			zTitle: 'New Bank Account',
			zContent: BankAccountsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Create Account',
			zOnOk: (instance: BankAccountsForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}
}
