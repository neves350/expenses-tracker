import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TransactionsService } from '@core/services/transactions.service'
import {
	ArrowRightLeftIcon,
	LucideAngularModule,
	PlusIcon,
} from 'lucide-angular'
import { TransactionsForm } from '@/shared/components/transactions/transactions-form/transactions-form'
import { TransactionsList } from '@/shared/components/transactions/transactions-list/transactions-list'
import { TransactionsNavigation } from '@/shared/components/transactions/transactions-navigation/transactions-navigation'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-transactions',
	imports: [
		ZardButtonComponent,
		LucideAngularModule,
		ZardCardComponent,
		TransactionsList,
		TransactionsNavigation,
	],
	templateUrl: './transactions.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {
	private readonly transactionsService = inject(TransactionsService)
	private readonly sheetService = inject(ZardSheetService)

	readonly transactions = this.transactionsService.transactions
	readonly loading = this.transactionsService.loading
	readonly hasTransactions = this.transactionsService.hasTransactions

	readonly PlusIcon = PlusIcon
	readonly ArrowRightLeftIcon = ArrowRightLeftIcon

	constructor() {
		this.transactionsService.loadTransactions().subscribe()
	}

	openSheet() {
		this.sheetService.create({
			zTitle: 'New Transaction',
			zContent: TransactionsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Add Transaction',
			zOnOk: (instance: TransactionsForm) => {
				instance.submit()
				return false
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}
}
