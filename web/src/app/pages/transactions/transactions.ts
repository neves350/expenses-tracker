import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core'
import { TransactionsService } from '@core/services/transactions.service'
import {
	ArrowRightLeftIcon,
	LucideAngularModule,
	PlusIcon,
} from 'lucide-angular'
import { TransactionsForm } from '@/shared/components/transactions/transactions-form/transactions-form'
import { TransactionsList } from '@/shared/components/transactions/transactions-list/transactions-list'
import { TransactionsToolbar } from '@/shared/components/transactions/transactions-toolbar/transactions-toolbar'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardDropdownImports } from '@/shared/components/ui/dropdown'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-transactions',
	imports: [
		ZardButtonComponent,
		LucideAngularModule,
		ZardCardComponent,
		ZardDropdownImports,
		TransactionsList,
		TransactionsToolbar,
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

	readonly searchQuery = signal('')

	constructor() {
		this.transactionsService.loadTransactions().subscribe()
	}

	readonly filteredTransactions = computed(() => {
		const query = this.searchQuery().toLowerCase().trim()
		const txs = this.transactionsService.transactions()

		return query
			? txs.filter((t) => t.title.toLowerCase().includes(query))
			: txs
	})

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
