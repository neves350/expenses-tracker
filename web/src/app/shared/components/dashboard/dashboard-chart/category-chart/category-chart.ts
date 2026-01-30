import { afterNextRender, Component, signal, viewChild } from '@angular/core'
import { ChartPieIcon, LucideAngularModule } from 'lucide-angular'
import { ChartComponent } from 'ng-apexcharts'
import { ZardCardComponent } from '@/shared/components/ui/card'
import {
	createDonutChartOptions,
	type DonutChartOptions,
} from './category-chart.config'

@Component({
	selector: 'app-category-chart',
	imports: [ZardCardComponent, LucideAngularModule, ChartComponent],
	templateUrl: './category-chart.html',
})
export class CategoryChart {
	readonly ChartPieIcon = ChartPieIcon

	readonly chart = viewChild<ChartComponent>('chart')
	readonly chartOptions = signal<Partial<DonutChartOptions> | null>(null)

	// Sample data - replace with actual data from API
	private readonly categories = [
		'Food & Dining',
		'Transportation',
		'Shopping',
		'Entertainment',
		'Bills',
	]
	private readonly amounts = [1250, 450, 380, 220, 890]

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})
	}

	private initChart(): void {
		this.chartOptions.set(
			createDonutChartOptions(this.categories, this.amounts),
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
