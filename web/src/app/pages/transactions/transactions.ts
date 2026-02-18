import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	signal,
	untracked,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import type { TransactionsQueryParams } from '@core/api/transactions.interface'
import { TransactionsService } from '@core/services/transactions.service'
import {
	ArrowRightLeftIcon,
	LucideAngularModule,
	PlusIcon,
} from 'lucide-angular'
import { TransactionsForm } from '@/shared/components/transactions/transactions-form/transactions-form'
import { TransactionsList } from '@/shared/components/transactions/transactions-list/transactions-list'
import { TransactionsNavigation } from '@/shared/components/transactions/transactions-navigation/transactions-navigation'
import { TransactionsSearch } from '@/shared/components/transactions/transactions-search/transactions-search'
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
		TransactionsSearch,
	],
	templateUrl: './transactions.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {
	private readonly transactionsService = inject(TransactionsService)
	private readonly sheetService = inject(ZardSheetService)
	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)

	readonly transactions = this.transactionsService.transactions
	readonly loading = this.transactionsService.loading
	readonly hasTransactions = this.transactionsService.hasTransactions

	readonly currentPage = signal(1)
	readonly searchQuery = signal('')

	readonly PlusIcon = PlusIcon
	readonly ArrowRightLeftIcon = ArrowRightLeftIcon

	readonly filteredTransactions = computed(() => {
		const query = this.searchQuery().toLowerCase().trim()
		const txs = this.transactionsService.transactions()

		return query
			? txs.filter((t) => t.title.toLowerCase().includes(query))
			: txs
	})

	constructor() {
		this.readUrlParams()
		this.transactionsService.loadTransactions().subscribe()

		// Reset page to 1 when month or year changes (skip first run)
		let isFirstRun = true
		effect(() => {
			this.transactionsService.selectedMonth()
			this.transactionsService.selectedYear()
			if (isFirstRun) {
				isFirstRun = false
				return
			}
			untracked(() => this.currentPage.set(1))
		})

		// Keep URL in sync with current state
		effect(() => {
			const month = this.transactionsService.selectedMonth() + 1
			const year = this.transactionsService.selectedYear()
			const page = this.currentPage()

			const now = new Date()
			const queryParams: Record<string, string | null> = {
				month: month !== now.getMonth() + 1 ? String(month) : null,
				year: year !== now.getFullYear() ? String(year) : null,
				page: page !== 1 ? String(page) : null,
			}

			this.router.navigate([], {
				relativeTo: this.route,
				queryParams,
				replaceUrl: true,
			})
		})
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

	private readUrlParams() {
		const params = this.route.snapshot.queryParamMap

		const month = Number(params.get('month'))
		if (month >= 1 && month <= 12) {
			this.transactionsService.selectedMonth.set(month - 1)
		}

		const year = Number(params.get('year'))
		if (year >= 2000 && year <= 2100) {
			this.transactionsService.selectedYear.set(year)
		}

		const page = Number(params.get('page'))
		if (page >= 1) {
			this.currentPage.set(page)
		}
	}
}
