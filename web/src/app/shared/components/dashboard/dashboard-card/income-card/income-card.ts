import { ZardCardComponent } from '@/shared/components/ui/card'
import { afterNextRender, Component, input, signal } from '@angular/core'
import {
	ArrowDownIcon,
	ArrowUpIcon,
	LucideAngularModule,
	TrendingUpIcon,
} from 'lucide-angular'

import { NgApexchartsModule } from 'ng-apexcharts'

import {
	createSparklineChartOptions,
	type SparklineChartOptions,
} from './income-card.config'

@Component({
	selector: 'app-income-card',
	imports: [ZardCardComponent, LucideAngularModule, NgApexchartsModule],
	templateUrl: './income-card.html',
})
export class IncomeCard {
	readonly income = input<number>(0)
	readonly percentageChange = input<number>(0)
	readonly chartData = input<number[]>([80, 100, 140, 120, 180])

	readonly TrendingUpIcon = TrendingUpIcon
	readonly chartOptions = signal<Partial<SparklineChartOptions> | null>(null)

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})
	}

	get formattedIncome(): string {
		return this.income().toLocaleString('pt-PT', {
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
