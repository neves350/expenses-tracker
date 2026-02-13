import { Component, input } from '@angular/core'
import { Goal } from '@core/api/goals.interface'
import { GoalHeader } from '@/shared/components/goals/goals-details/goal-header/goal-header'

@Component({
	selector: 'app-goals-details',
	imports: [GoalHeader],
	templateUrl: './goals-details.html',
})
export class GoalsDetails {
	readonly goal = input.required<Goal>()
}
