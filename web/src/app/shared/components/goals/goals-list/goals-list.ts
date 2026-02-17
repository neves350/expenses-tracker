import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	signal,
} from '@angular/core'
import type { Goal } from '@core/api/goals.interface'
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
} from '../../ui/table'
import { GoalsCard } from '../goals-card/goals-card'

type SortKey = 'title' | 'progress' | 'amount' | 'status'

@Component({
	selector: 'app-goals-list',
	imports: [
		GoalsCard,
		LucideAngularModule,
		ZardTableComponent,
		ZardTableHeaderComponent,
		ZardTableRowComponent,
		ZardTableHeadComponent,
		ZardTableBodyComponent,
		ZardPaginationComponent,
	],
	templateUrl: './goals-list.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsList {
	readonly goals = input.required<Goal[]>()

	protected readonly pageSize = 7
	protected readonly currentPage = signal(1)
	protected readonly sortState = signal<{
		key: SortKey
		direction: 'asc' | 'desc'
	}>({ key: 'title', direction: 'asc' })

	readonly totalPages = computed(() =>
		Math.ceil(this.goals().length / this.pageSize),
	)

	readonly sortedGoals = computed(() => {
		const { key, direction } = this.sortState()
		const modifier = direction === 'asc' ? 1 : -1

		return [...this.goals()].sort((a, b) => {
			switch (key) {
				case 'title':
					return a.title.localeCompare(b.title) * modifier
				case 'progress':
					return (a.progress - b.progress) * modifier
				case 'amount':
					return (a.amount - b.amount) * modifier
				case 'status':
					return a.paceStatus.localeCompare(b.paceStatus) * modifier
				default:
					return 0
			}
		})
	})

	readonly paginatedGoals = computed(() => {
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
