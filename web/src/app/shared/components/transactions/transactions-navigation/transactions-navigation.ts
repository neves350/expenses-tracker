import { NgClass } from '@angular/common'
import {
	afterNextRender,
	Component,
	computed,
	ElementRef,
	inject,
	viewChild,
} from '@angular/core'
import { TransactionsService } from '@core/services/transactions.service'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	LucideAngularModule,
} from 'lucide-angular'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

@Component({
	selector: 'app-transactions-navigation',
	imports: [
		NgClass,
		ZardButtonComponent,
		ZardCardComponent,
		ZardSelectComponent,
		ZardSelectItemComponent,
		LucideAngularModule,
	],
	templateUrl: './transactions-navigation.html',
})
export class TransactionsNavigation {
	private readonly transactionsService = inject(TransactionsService)
	private readonly scrollContainer =
		viewChild<ElementRef<HTMLElement>>('monthScroll')

	readonly ChevronLeftIcon = ChevronLeftIcon
	readonly ChevronRightIcon = ChevronRightIcon

	readonly months = MONTHS

	readonly selectedYear = computed(() =>
		String(this.transactionsService.selectedYear()),
	)
	readonly selectedMonth = this.transactionsService.selectedMonth

	readonly years = computed(() => {
		const current = new Date().getFullYear()
		const result: string[] = []
		for (let y = current - 3; y <= current + 3; y++) {
			result.push(String(y))
		}
		return result
	})

	constructor() {
		afterNextRender(() => {
			this.scrollToActiveMonth()
		})
	}

	selectMonth(index: number) {
		this.transactionsService.selectedMonth.set(index)
		this.transactionsService.loadTransactions().subscribe()
	}

	onYearChange(year: string | string[]) {
		this.transactionsService.selectedYear.set(Number(year))
		this.transactionsService.loadTransactions().subscribe()
	}

	goToToday() {
		const now = new Date()
		this.transactionsService.selectedYear.set(now.getFullYear())
		this.transactionsService.selectedMonth.set(now.getMonth())
		this.transactionsService.loadTransactions().subscribe()
		this.scrollToActiveMonth()
	}

	scroll(direction: -1 | 1) {
		const current = this.selectedMonth()
		const next = current + direction
		if (next < 0 || next > 11) return
		this.selectMonth(next)
		this.scrollToActiveMonth()
	}

	private scrollToActiveMonth() {
		const el = this.scrollContainer()?.nativeElement
		if (!el) return
		const active = el.children[this.selectedMonth()] as HTMLElement
		if (active) {
			active.scrollIntoView({ inline: 'center', behavior: 'smooth' })
		}
	}
}
