import { Component, inject } from '@angular/core'
import {
	CircleAlertIcon,
	LucideAngularModule,
	PlusIcon,
	RepeatIcon,
} from 'lucide-angular'
import { RecurringsForm } from '@/shared/components/recurrings/recurrings-form/recurrings-form'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardDialogService } from '@/shared/components/ui/dialog'
import {
	ZardPopoverComponent,
	ZardPopoverDirective,
} from '@/shared/components/ui/popover'

@Component({
	selector: 'app-recurrings',
	imports: [
		ZardButtonComponent,
		LucideAngularModule,
		ZardCardComponent,
		ZardPopoverDirective,
		ZardPopoverComponent,
	],
	templateUrl: './recurrings.html',
})
export class Recurrings {
	private readonly dialogService = inject(ZardDialogService)

	readonly PlusIcon = PlusIcon
	readonly RepeatIcon = RepeatIcon
	readonly CircleAlertIcon = CircleAlertIcon

	openDialog() {
		this.dialogService.create({
			zTitle: 'New Recurring Transaction',
			zContent: RecurringsForm,
			zWidth: '700px',
			zHideFooter: false,
			zOkText: 'Create recurring',
			zOnOk: (instance: RecurringsForm) => {
				instance.submit()
				return false
			},
			zCustomClasses:
				'rounded-2xl border-4 [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}
}
