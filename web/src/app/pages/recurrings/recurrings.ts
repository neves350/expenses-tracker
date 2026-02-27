import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RecurringsService } from '@core/services/recurrings.service'
import {
	CircleAlertIcon,
	LucideAngularModule,
	PlusIcon,
	RepeatIcon,
} from 'lucide-angular'
import { RecurringsCard } from '@/shared/components/recurrings/recurrings-card/recurrings-card'
import { RecurringsForm } from '@/shared/components/recurrings/recurrings-form/recurrings-form'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardDialogService } from '@/shared/components/ui/dialog'
import { ZardLoaderComponent } from '@/shared/components/ui/loader'
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
		RecurringsCard,
		ZardLoaderComponent,
	],
	templateUrl: './recurrings.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Recurrings {
	private readonly recurringsService = inject(RecurringsService)
	private readonly dialogService = inject(ZardDialogService)

	readonly recurrings = this.recurringsService.recurrings
	readonly hasRecurrings = this.recurringsService.hasRecurrings
	readonly isLoading = this.recurringsService.loading

	readonly PlusIcon = PlusIcon
	readonly RepeatIcon = RepeatIcon
	readonly CircleAlertIcon = CircleAlertIcon

	constructor() {
		this.recurringsService.loadRecurrings().subscribe()
	}

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
