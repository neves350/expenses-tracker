import {
	afterNextRender,
	Component,
	computed,
	input,
	signal,
} from '@angular/core'
import { LucideAngularModule, PiggyBankIcon } from 'lucide-angular'
import { NgApexchartsModule } from 'ng-apexcharts'
import { ZardCardComponent } from '@/shared/components/ui/card'
import {
	createRadialChartOptions,
	type RadialChartOptions,
} from './goal-card.config'

@Component({
	selector: 'app-goal-card',
	imports: [ZardCardComponent, LucideAngularModule, NgApexchartsModule],
	templateUrl: './goal-card.html',
})
export class GoalCard {
	readonly goalName = input<string>('')
	readonly currentAmount = input<number>(0)
	readonly targetAmount = input<number>(1)

	readonly PiggyBankIcon = PiggyBankIcon
	readonly chartOptions = signal<Partial<RadialChartOptions> | null>(null)

	readonly percentage = computed(() => {
		const target = this.targetAmount()
		if (target <= 0) return 0
		return Math.min((this.currentAmount() / target) * 100, 100)
	})

	readonly formattedCurrentAmount = computed(() => {
		return (
			this.currentAmount().toLocaleString('pt-PT', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}) + '€'
		)
	})

	readonly formattedTargetAmount = computed(() => {
		return (
			this.targetAmount().toLocaleString('pt-PT', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}) + '€'
		)
	})

	constructor() {
		afterNextRender(() => {
			this.initChart()
			this.observeThemeChanges()
		})
	}

	private initChart(): void {
		this.chartOptions.set(createRadialChartOptions(this.percentage()))
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
