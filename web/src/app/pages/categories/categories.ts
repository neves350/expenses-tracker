import { Component, inject, type OnInit } from '@angular/core'
import { CategoriesService } from '@core/services/categories.service'
import { LucideAngularModule, PlusIcon } from 'lucide-angular'
import { CategoriesForm } from '@/shared/components/categories/categories-form/categories-form'
import { CategoriesList } from '@/shared/components/categories/categories-list/categories-list'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardDialogService } from '@/shared/components/ui/dialog'

@Component({
	selector: 'app-categories',
	imports: [ZardButtonComponent, LucideAngularModule, CategoriesList],
	templateUrl: './categories.html',
})
export class Categories implements OnInit {
	private readonly categoriesService = inject(CategoriesService)
	private readonly dialogService = inject(ZardDialogService)

	readonly PlusIcon = PlusIcon

	readonly categories = this.categoriesService.categories
	readonly loading = this.categoriesService.loading

	readonly expenseCategories = this.categoriesService.expenseCategories
	readonly incomeCategories = this.categoriesService.incomeCategories

	ngOnInit(): void {
		this.categoriesService.loadCategories().subscribe()
	}

	openDialog() {
		this.dialogService.create({
			zTitle: 'New Category',
			zContent: CategoriesForm,
			zWidth: '425px',
			zHideFooter: false,
			zOkText: 'Create',
			zOnOk: (instance: CategoriesForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
		})
	}
}
