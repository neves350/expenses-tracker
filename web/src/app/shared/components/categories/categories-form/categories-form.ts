import { Component, computed, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CategoryType } from '@core/api/categories.interface'
import { CategoriesService } from '@core/services/categories.service'
import { Z_MODAL_DATA, ZardDialogRef } from '../../ui/dialog'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'
import { IconPicker } from '../icon-picker/icon-picker'
import type { iCategorySheetData } from './categories-form.interface'

@Component({
	selector: 'app-categories-form',
	imports: [
		ReactiveFormsModule,
		ZardSelectItemComponent,
		ZardSelectComponent,
		IconPicker,
	],
	templateUrl: './categories-form.html',
})
export class CategoriesForm {
	private readonly categoriesService = inject(CategoriesService)
	private readonly zData: iCategorySheetData = inject(Z_MODAL_DATA)
	private readonly dialogRef = inject(ZardDialogRef)
	private readonly fb = inject(FormBuilder)

	form = this.fb.nonNullable.group({
		title: ['', [Validators.required]],
		icon: ['', [Validators.required]],
		type: [CategoryType.EXPENSE, [Validators.required]],
	})

	constructor() {
		if (this.zData?.id) {
			this.form.patchValue({
				title: this.zData.title ?? '',
				icon: this.zData.icon ?? '',
				type: this.zData.type ?? CategoryType.EXPENSE,
			})
		}
	}

	readonly isEditMode = computed(() => !!this.zData?.id)

	readonly categoryTypes = Object.values(CategoryType)

	readonly typeLabels: Record<CategoryType, string> = {
		[CategoryType.EXPENSE]: 'Expense',
		[CategoryType.INCOME]: 'Income',
	}

	getTypeLabel(type: CategoryType): string {
		return this.typeLabels[type]
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

		const request$ = this.zData?.id
			? this.categoriesService.update(this.zData.id, payload)
			: this.categoriesService.create(payload)

		request$.subscribe({
			next: () => this.dialogRef.close(),
		})
	}
}
