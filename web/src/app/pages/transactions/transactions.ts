import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core'
import { TransactionsApi } from '@core/api/transactions.api'
import type { TransactionsQueryParams } from '@core/api/transactions.interface'
import { TransactionsService } from '@core/services/transactions.service'
import { lastValueFrom } from 'rxjs'
import { toast } from 'ngx-sonner'
import {
	ArrowRightLeftIcon,
	CalendarCheck2Icon,
	EllipsisIcon,
	LucideAngularModule,
	PlusIcon,
	Trash2Icon,
} from 'lucide-angular'
import { TransactionsForm } from '@/shared/components/transactions/transactions-form/transactions-form'
import { TransactionsList } from '@/shared/components/transactions/transactions-list/transactions-list'
import { TransactionsNavigation } from '@/shared/components/transactions/transactions-navigation/transactions-navigation'
import { TransactionsSearch } from '@/shared/components/transactions/transactions-search/transactions-search'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardDialogService } from '@/shared/components/ui/dialog'
import { ZardDividerComponent } from '@/shared/components/ui/divider'
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
		TransactionsNavigation,
		TransactionsSearch,
		ZardDividerComponent,
	],
	templateUrl: './transactions.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {
	private readonly transactionsService = inject(TransactionsService)
	private readonly transactionsApi = inject(TransactionsApi)
	private readonly sheetService = inject(ZardSheetService)
	private readonly dialogService = inject(ZardDialogService)

	readonly transactions = this.transactionsService.transactions
	readonly loading = this.transactionsService.loading
	readonly hasTransactions = this.transactionsService.hasTransactions

	readonly currentPage = signal(1)
	readonly searchQuery = signal('')

	readonly PlusIcon = PlusIcon
	readonly ArrowRightLeftIcon = ArrowRightLeftIcon
	readonly EllipsisIcon = EllipsisIcon
	readonly CalendarCheck2Icon = CalendarCheck2Icon
	readonly Trash2Icon = Trash2Icon

	readonly filteredTransactions = computed(() => {
		const query = this.searchQuery().toLowerCase().trim()
		const txs = this.transactionsService.transactions()

		return query
			? txs.filter((t) => t.title.toLowerCase().includes(query))
			: txs
	})

	constructor() {
		this.transactionsService.loadTransactions().subscribe()
	}

	onSearch(query: string) {
		this.searchQuery.set(query)
	}

	onFilterChange(params: TransactionsQueryParams) {
		this.currentPage.set(1)
		this.transactionsService.loadTransactions(params).subscribe()
	}

	onFilterReset() {
		this.searchQuery.set('')
		this.currentPage.set(1)
		this.transactionsService.loadTransactions().subscribe()
	}

	async markAllAsPaid() {
		const unpaid = this.transactions().filter((t) => !t.isPaid)
		if (!unpaid.length) {
			toast.info('All transactions are already paid')
			return
		}

		try {
			await Promise.all(
				unpaid
					.filter((t) => t.id)
					.map((t) =>
						lastValueFrom(
							this.transactionsApi.update(t.id as string, { isPaid: true }),
						),
					),
			)
			this.transactionsService.loadTransactions().subscribe()
			toast.success('All transactions marked as paid')
		} catch {
			toast.error('Failed to mark transactions as paid')
		}
	}

	deleteAll() {
		this.dialogService.create({
			zTitle: 'Delete all transactions?',
			zDescription:
				'This will permanently delete all transactions this month. This action cannot be undone.',
			zOkText: 'Delete all',
			zOkDestructive: true,
			zOnOk: async () => {
				try {
					await Promise.all(
						this.transactions()
							.filter((t) => t.id)
							.map((t) =>
								lastValueFrom(this.transactionsApi.delete(t.id as string)),
							),
					)
					this.transactionsService.loadTransactions().subscribe()
					toast.success('All transactions deleted')
					return true
				} catch {
					toast.error('Failed to delete transactions')
					return false
				}
			},
		})
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
