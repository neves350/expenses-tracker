import { Component, input } from '@angular/core'
import { Goal } from '@core/api/goals.interface'
import { GoalHeader } from '@/shared/components/goals/goals-details/goal-header/goal-header'
import { GoalSummary } from '@/shared/components/goals/goals-details/goal-summary/goal-summary'

@Component({
	selector: 'app-goals-details',
	imports: [GoalHeader, GoalSummary],
	templateUrl: './goals-details.html',
})
export class GoalsDetails {
	readonly goal = input.required<Goal>()
}
