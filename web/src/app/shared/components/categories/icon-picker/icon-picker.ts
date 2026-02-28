import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	signal,
} from '@angular/core'
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { LucideAngularModule } from 'lucide-angular'
import {
	ZardPopoverCloseDirective,
	ZardPopoverComponent,
	ZardPopoverDirective,
} from '../../ui/popover'
import { CATEGORY_ICON_GROUPS, CATEGORY_ICON_MAP } from '../category-icons'

@Component({
	selector: 'app-icon-picker',
	imports: [
		LucideAngularModule,
		ZardPopoverDirective,
		ZardPopoverCloseDirective,
		ZardPopoverComponent,
	],
	templateUrl: './icon-picker.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => IconPicker),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPicker implements ControlValueAccessor {
	readonly iconMap = CATEGORY_ICON_MAP
	readonly iconGroups = CATEGORY_ICON_GROUPS

	protected readonly selectedIcon = signal<string>('')

	private onChange: (value: string) => void = () => {}
	private onTouched: () => void = () => {}

	selectIcon(icon: string): void {
		this.selectedIcon.set(icon)
		this.onChange(icon)
		this.onTouched()
	}

	getIconClasses(icon: string): string {
		const base =
			'flex items-center justify-center p-2 rounded-md border cursor-pointer transition-colors'
		return this.selectedIcon() === icon
			? `${base} border-primary bg-primary/10`
			: `${base} border-transparent hover:bg-accent`
	}

	writeValue(value: string): void {
		this.selectedIcon.set(value ?? '')
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn
	}
}
