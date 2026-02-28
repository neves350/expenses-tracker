import { Component, computed, inject, input, output } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CategoryType } from '@core/api/categories.interface'
import type { Category } from '@core/api/categories.interface'
import { CategoriesService } from '@core/services/categories.service'
import {
	CirclePlusIcon,
	LucideAngularModule,
	SaveIcon,
	XIcon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardInputDirective } from '../../ui/input'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'
import { IconPicker } from '../icon-picker/icon-picker'

@Component({
	selector: 'app-categories-form',
	imports: [
		ReactiveFormsModule,
		ZardSelectItemComponent,
		ZardSelectComponent,
		IconPicker,
		ZardButtonComponent,
		LucideAngularModule,
		ZardCardComponent,
		ZardInputDirective,
	],
	templateUrl: './categories-form.html',
})
export class CategoriesForm {
	private readonly categoriesService = inject(CategoriesService)
	private readonly fb = inject(FormBuilder)

	readonly category = input<Category | null>(null)
	readonly editDone = output<void>()

	readonly CirclePlusIcon = CirclePlusIcon
	readonly SaveIcon = SaveIcon
	readonly XIcon = XIcon

	form = this.fb.nonNullable.group({
		title: ['', [Validators.required]],
		icon: ['', [Validators.required]],
		type: [CategoryType.EXPENSE, [Validators.required]],
	})

	readonly isEditMode = computed(() => !!this.category()?.id)
	readonly categoryTypes = Object.values(CategoryType)

	readonly typeLabels: Record<CategoryType, string> = {
		[CategoryType.EXPENSE]: 'Expense',
		[CategoryType.INCOME]: 'Income',
	}

	getTypeLabel(type: CategoryType): string {
		return this.typeLabels[type]
	}

	fillForm(category: Category): void {
		this.form.patchValue({
			title: category.title ?? '',
			icon: category.icon ?? '',
			type: category.type ?? CategoryType.EXPENSE,
		})
	}

	cancelEdit(): void {
		this.resetForm()
		this.editDone.emit()
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}

		const formValue = this.form.getRawValue()
		const payload = {
			title: formValue.title,
			icon: formValue.icon,
			type: formValue.type,
		}

		const categoryId = this.category()?.id
		const request$ = categoryId
			? this.categoriesService.update(categoryId, payload)
			: this.categoriesService.create(payload)

		const action = this.isEditMode() ? 'updated' : 'created'

		request$.subscribe({
			next: () => {
				toast.success(`Category ${action} successfully`)
				this.resetForm()
				this.editDone.emit()
			},
			error: () => {
				toast.error(
					`Failed to ${this.isEditMode() ? 'update' : 'create'} category`,
				)
			},
		})
	}

	private resetForm(): void {
		this.form.reset({
			title: '',
			icon: '',
			type: CategoryType.EXPENSE,
		})
	}
}
