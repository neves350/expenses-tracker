import { Component, computed, inject, input } from '@angular/core'
import { Goal } from '@core/api/goals.interface'
import { GoalsService } from '@core/services/goals.service'
import {
	CalendarDaysIcon,
	CalendarIcon,
	CalendarRangeIcon,
	HourglassIcon,
	LucideAngularModule,
	TrendingUpIcon,
} from 'lucide-angular'
import { ZardBadgeComponent } from '@/shared/components/ui/badge'
import { ZardCardComponent } from '@/shared/components/ui/card'

@Component({
	selector: 'app-goal-breakdown',
	imports: [ZardCardComponent, LucideAngularModule, ZardBadgeComponent],
	templateUrl: './goal-breakdown.html',
})
export class GoalBreakdown {
	private readonly goalsService = inject(GoalsService)

	readonly goal = input.required<Goal>()

	readonly TrendingUpIcon = TrendingUpIcon
	readonly HourglassIcon = HourglassIcon
	readonly CalendarDaysIcon = CalendarDaysIcon
	readonly CalendarRangeIcon = CalendarRangeIcon
	readonly CalendarIcon = CalendarIcon

	readonly displayGoal = computed(() => {
		const goals = this.goalsService.goals()
		const initial = this.goal()
		return goals.find((g) => g.id === initial.id) ?? initial
	})

	private formatCurrency(value: number) {
		const currency = this.displayGoal().bankAccount?.currency ?? 'EUR'
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(value)
	}

	readonly formattedDailyAmount = computed(() =>
		this.formatCurrency(this.displayGoal().breakdown?.daily ?? 0),
	)

	readonly formattedWeeklyAmount = computed(() =>
		this.formatCurrency(this.displayGoal().breakdown?.weekly ?? 0),
	)

	readonly formattedMonthlyAmount = computed(() =>
		this.formatCurrency(this.displayGoal().breakdown?.monthly ?? 0),
	)

	readonly formattedDaysLeft = computed(() => {
		const days = this.displayGoal().breakdown?.daysRemaining ?? 0
		return days === 1 ? '1 day left' : `${days} days left`
	})
}
