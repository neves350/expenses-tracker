import {
	afterNextRender,
	Component,
	computed,
	effect,
	inject,
	signal,
	viewChild,
} from '@angular/core'
import { StatisticsService } from '@core/services/statistics.service'
import { LucideAngularModule, TagsIcon } from 'lucide-angular'
import { ChartComponent } from 'ng-apexcharts'
import { ZardCardComponent } from '../../ui/card'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'
import {
	createSemiDonutOptions,
	type SemiDonutChartOptions,
} from './statistics-categories.config'

@Component({
	selector: 'app-statistics-categories',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ChartComponent,
		ZardSelectComponent,
		ZardSelectItemComponent,
	],
	templateUrl: './statistics-categories.html',
})
export class StatisticsCategories {
	private readonly statisticsService = inject(StatisticsService)

	readonly TagsIcon = TagsIcon
	readonly selectedType = signal<'EXPENSE' | 'INCOME'>('EXPENSE')
	readonly chart = viewChild<ChartComponent>('chart')
	readonly chartOptions = signal<Partial<SemiDonutChartOptions> | null>(null)

	readonly categoryData = computed(() =>
		this.selectedType() === 'EXPENSE'
			? this.statisticsService.expenseByCategory()
			: this.statisticsService.incomeByCategory(),
	)

	readonly categories = computed(() => this.categoryData()?.categories ?? [])

	readonly totalTransactions = computed(
		() => this.categoryData()?.totalTransactions ?? 0,
	)

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})

		effect(() => {
			const cats = this.categories()
			if (cats) this.initChart()
		})
	}

	onTypeChange(value: string | string[]): void {
		const val = Array.isArray(value) ? value[0] : value
		this.selectedType.set(val as 'EXPENSE' | 'INCOME')
	}

	private initChart(): void {
		const cats = this.categories()
		if (!cats || cats.length === 0) {
			this.chartOptions.set(null)
			return
		}

		const labels = cats.map((c) => c.categoryTitle)
		const amounts = cats.map((c) => c.total)
		this.chartOptions.set(
			createSemiDonutOptions(labels, amounts, this.totalTransactions()),
		)
	}

	private observeThemeChanges(): void {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'class'
				) {
					this.initChart()
				}
			}
		})

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		})
	}
}
