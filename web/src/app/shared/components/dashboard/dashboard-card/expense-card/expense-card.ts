import { ZardCardComponent } from '@/shared/components/ui/card'
import { afterNextRender, Component, input, signal } from '@angular/core'
import { LucideAngularModule, TrendingDownIcon } from 'lucide-angular'
import { NgApexchartsModule } from 'ng-apexcharts'

import {
	createSparklineChartOptions,
	type SparklineChartOptions,
} from './expense-card.config'

@Component({
	selector: 'app-expense-card',
	imports: [ZardCardComponent, LucideAngularModule, NgApexchartsModule],
	templateUrl: './expense-card.html',
})
export class ExpenseCard {
	readonly expense = input<number>(0)
	readonly percentageChange = input<number>(0)
	readonly chartData = input<number[]>([120, 95, 140, 110, 130, 100])

	readonly TrendingDownIcon = TrendingDownIcon
	readonly chartOptions = signal<Partial<SparklineChartOptions> | null>(null)

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})
	}

	get formattedExpense(): string {
		return this.expense().toLocaleString('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}) + '€'
	}

	private initChart(): void {
		this.chartOptions.set(createSparklineChartOptions(this.chartData()))
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
