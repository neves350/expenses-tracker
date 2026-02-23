import { computed, Injectable, inject, signal } from '@angular/core'
import { StatisticsApi } from '@core/api/statistics.api'
import type {
	StatisticsByCategory,
	StatisticsOverview,
	StatisticsQueryParams,
	StatisticsTrends,
} from '@core/api/statistics.interface'
import { forkJoin, Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class StatisticsService {
	private readonly statisticsApi = inject(StatisticsApi)

	readonly overview = signal<StatisticsOverview | null>(null)
	readonly trends = signal<StatisticsTrends | null>(null)
	readonly byCategory = signal<StatisticsByCategory[] | null>(null)
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	readonly hasData = computed(() => {
		const overview = this.overview()
		return overview !== null && overview.transactionCount > 0
	})

	readonly expenseCategories = computed(() => {
		const data = this.byCategory()
		if (!data) return []
		const group = data.find((item) => item.type === 'EXPENSE')
		return group?.categories ?? []
	})

	readonly incomeCategories = computed(() => {
		const data = this.byCategory()
		if (!data) return []
		const group = data.find((item) => item.type === 'INCOME')
		return group?.categories ?? []
	})

	loadStatistics(
		params?: StatisticsQueryParams,
	): Observable<
		[StatisticsOverview, StatisticsTrends, StatisticsByCategory[]]
	> {
		this.loading.set(true)
		this.error.set(null)

		return forkJoin([
			this.statisticsApi.getOverview(params),
			this.statisticsApi.getTrends(params),
			this.statisticsApi.getByCategory(params),
		]).pipe(
			tap({
				next: ([overview, trends, byCategory]) => {
					this.overview.set(overview)
					this.trends.set(trends)
					this.byCategory.set(byCategory)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to load statistics')
					this.loading.set(false)
				},
			}),
		)
	}
}
