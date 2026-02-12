import { Component, inject } from '@angular/core'
import { GoalsService } from '@core/services/goals.service'
import { GoalIcon, LucideAngularModule, PlusIcon } from 'lucide-angular'
import { GoalsForm } from '@/shared/components/goals/goals-form/goals-form'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-goals',
	imports: [ZardButtonComponent, LucideAngularModule, ZardCardComponent],
	templateUrl: './goals.html',
})
export class Goals {
	readonly PlusIcon = PlusIcon
	readonly GoalIcon = GoalIcon

	private readonly sheetService = inject(ZardSheetService)
	private readonly goalsService = inject(GoalsService)

	ngOnInit(): void {
		this.goalsService.loadGoals().subscribe()
	}

	openSheet() {
		this.sheetService.create({
			zTitle: 'New Goal',
			zContent: GoalsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Create Goal',
			zOnOk: (instance: GoalsForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}
}
