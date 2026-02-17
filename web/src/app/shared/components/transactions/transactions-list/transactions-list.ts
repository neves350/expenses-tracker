import { Component, computed, input, signal } from '@angular/core'
import { Transaction } from '@core/api/transactions.interface'
import {
	ArrowDown01Icon,
	ArrowDownAZIcon,
	ArrowUp01Icon,
	ArrowUpAZIcon,
	LucideAngularModule,
	type LucideIconData,
} from 'lucide-angular'
import { ZardPaginationComponent } from '../../ui/pagination'
import {
	ZardTableBodyComponent,
	ZardTableComponent,
	ZardTableHeadComponent,
	ZardTableHeaderComponent,
	ZardTableRowComponent,
} from '../../ui/table/table.component'
import { TransactionsRow } from '../transactions-row/transactions-row'

type SortKey =
	| 'date'
	| 'description'
	| 'account'
	| 'category'
	| 'amount'
	| 'status'

@Component({
	selector: 'app-transactions-list',
	imports: [
		LucideAngularModule,
		TransactionsRow,
		ZardPaginationComponent,
		ZardTableComponent,
		ZardTableHeaderComponent,
		ZardTableRowComponent,
		ZardTableHeadComponent,
		ZardTableBodyComponent,
	],
	templateUrl: './transactions-list.html',
})
export class TransactionsList {
	readonly transactions = input.required<Transaction[]>()

	protected readonly pageSize = 13
	protected readonly currentPage = signal(1)
	protected readonly sortState = signal<{
		key: SortKey
		direction: 'asc' | 'desc'
	}>({ key: 'date', direction: 'desc' })

	readonly totalPages = computed(() =>
		Math.ceil(this.transactions().length / this.pageSize),
	)

	readonly sortedGoals = computed(() => {
		const { key, direction } = this.sortState()
		const modifier = direction === 'asc' ? 1 : -1

		return [...this.transactions()].sort((a, b) => {
			switch (key) {
				case 'date':
					return (
						(new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier
					)
				case 'description':
					return a.title.localeCompare(b.title) * modifier
				case 'account':
					return a.bankAccountId.localeCompare(b.bankAccountId) * modifier
				case 'category':
					return a.categoryId.localeCompare(b.categoryId) * modifier
				case 'amount':
					return (a.amount - b.amount) * modifier
				case 'status':
					return ((a.isPaid ? 1 : 0) - (b.isPaid ? 1 : 0)) * modifier
				default:
					return 0
			}
		})
	})

	readonly paginatedTransactions = computed(() => {
		const startPage = (this.currentPage() - 1) * this.pageSize
		return this.sortedGoals().slice(startPage, startPage + this.pageSize)
	})

	toggleSort(key: SortKey) {
		const current = this.sortState()
		if (current.key === key) {
			this.sortState.set({
				key,
				direction: current.direction === 'asc' ? 'desc' : 'asc',
			})
		} else {
			this.sortState.set({ key, direction: 'asc' })
		}
		this.currentPage.set(1)
	}

	sortTextIcon(key: SortKey): LucideIconData {
		const current = this.sortState()
		if (current.key !== key) return ArrowDownAZIcon
		return current.direction === 'asc' ? ArrowUpAZIcon : ArrowDownAZIcon
	}

	sortNumberIcon(key: SortKey): LucideIconData {
		const current = this.sortState()
		if (current.key !== key) return ArrowDown01Icon
		return current.direction === 'asc' ? ArrowUp01Icon : ArrowDown01Icon
	}
}
