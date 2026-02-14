import { Component, input } from '@angular/core'
import { Goal } from '@core/api/goals.interface'
import { GoalBreakdown } from '@/shared/components/goals/goals-details/goal-breakdown/goal-breakdown'
import { GoalHeader } from '@/shared/components/goals/goals-details/goal-header/goal-header'
import { GoalSavedMoney } from '@/shared/components/goals/goals-details/goal-saved-money/goal-saved-money'
import { GoalSummary } from '@/shared/components/goals/goals-details/goal-summary/goal-summary'

@Component({
	selector: 'app-goals-details',
	imports: [GoalHeader, GoalSummary, GoalSavedMoney, GoalBreakdown],
	templateUrl: './goals-details.html',
})
export class GoalsDetails {
	readonly goal = input.required<Goal>()
}
