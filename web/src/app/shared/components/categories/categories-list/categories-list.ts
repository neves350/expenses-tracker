import { Component, inject, input } from '@angular/core'
import type { Category } from '@core/api/categories.interface'
import { CategoriesService } from '@core/services/categories.service'
import { LucideAngularModule, SquarePenIcon, Trash2Icon } from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { lastValueFrom } from 'rxjs'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardDialogService } from '../../ui/dialog'
import { ZardDividerComponent } from '../../ui/divider'
import { CategoriesForm } from '../categories-form/categories-form'
import type { iCategorySheetData } from '../categories-form/categories-form.interface'
import { CATEGORY_ICON_MAP } from '../category-icons'

@Component({
	selector: 'app-categories-list',
	imports: [
		ZardCardComponent,
		ZardButtonComponent,
		LucideAngularModule,
		ZardDividerComponent,
		ZardBadgeComponent,
	],
	templateUrl: './categories-list.html',
})
export class CategoriesList {
	readonly categories = input.required<Category[]>()
	readonly title = input.required<string>()
	readonly dotColor = input<string>('bg-red-500')
	readonly iconMap = CATEGORY_ICON_MAP

	private readonly dialogService = inject(ZardDialogService)
	private readonly categoriesService = inject(CategoriesService)

	readonly SquarePenIcon = SquarePenIcon
	readonly Trash2Icon = Trash2Icon

	editCategory(category: Category) {
		this.dialogService.create({
			zTitle: 'Edit Category',
			zContent: CategoriesForm,
			zHideFooter: false,
			zOkText: 'Save Changes',
			zOnOk: (instance: CategoriesForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
			zData: {
				id: category.id,
				title: category.title,
				type: category.type,
				icon: category.icon,
			} as iCategorySheetData,
		})
	}

	deleteCategory(category: Category) {
		const categoryId = category.id
		if (!categoryId) return

		return this.dialogService.create({
			zTitle: `Remove ${category.title}?`,
			zDescription: 'This action cannot be undone.',
			zCancelText: 'Cancel',
			zOkText: 'Delete Category',
			zOkDestructive: true,
			zOnOk: async () => {
				try {
					const message = await lastValueFrom(
						this.categoriesService.delete(categoryId),
					)
					toast.success(message)
					this.categoriesService.loadCategories().subscribe()
					return true
				} catch (err: unknown) {
					const error = err as { error?: { message?: string } }
					toast.error(error.error?.message || 'Failed to delete category')
					return false
				}
			},
		})
	}
}
