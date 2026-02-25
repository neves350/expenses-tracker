import { Component } from '@angular/core'
import {
	CircleAlertIcon,
	LucideAngularModule,
	PlusIcon,
	RepeatIcon,
} from 'lucide-angular'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
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
	readonly PlusIcon = PlusIcon
	readonly RepeatIcon = RepeatIcon
	readonly CircleAlertIcon = CircleAlertIcon
}
