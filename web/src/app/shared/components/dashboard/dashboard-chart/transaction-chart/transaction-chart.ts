import { afterNextRender, Component, signal, viewChild } from '@angular/core'
import { ChartSplineIcon, LucideAngularModule } from 'lucide-angular'
import { ChartComponent } from 'ng-apexcharts'
import { ZardCardComponent } from '@/shared/components/ui/card'
import {
	type ChartOptions,
	createChartOptions,
} from './transaction-chart.config'

@Component({
	selector: 'app-transaction-chart',
	imports: [ZardCardComponent, LucideAngularModule, ChartComponent],
	templateUrl: './transaction-chart.html',
})
export class TransactionChart {
	readonly ChartSplineIcon = ChartSplineIcon

	readonly chart = viewChild<ChartComponent>('chart')
	readonly chartOptions = signal<Partial<ChartOptions> | null>(null)

	// Sample data - replace with actual data from API
	private readonly incomeData = [
		2800, 3200, 2950, 5400, 3100, 3650, 4200, 3800, 3500, 4100, 3900, 4500,
	]
	private readonly expenseData = [
		2800, 2100, 950, 2400, 2200, 3800, 2500, 2900, 1700, 3100, 2850, 3200,
	]

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})
	}

	private initChart(): void {
		this.chartOptions.set(createChartOptions(this.incomeData, this.expenseData))
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
