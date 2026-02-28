import { Component, inject, signal, viewChild, type OnInit } from '@angular/core'
import type { Category } from '@core/api/categories.interface'
import { CategoriesService } from '@core/services/categories.service'
import { CategoriesForm } from '@/shared/components/categories/categories-form/categories-form'
import { CategoriesList } from '@/shared/components/categories/categories-list/categories-list'

@Component({
	selector: 'app-categories',
	imports: [CategoriesList, CategoriesForm],
	templateUrl: './categories.html',
})
export class Categories implements OnInit {
	private readonly categoriesService = inject(CategoriesService)
	private readonly categoriesForm = viewChild(CategoriesForm)

	readonly editingCategory = signal<Category | null>(null)
	readonly expenseCategories = this.categoriesService.expenseCategories
	readonly incomeCategories = this.categoriesService.incomeCategories

	ngOnInit(): void {
		this.categoriesService.loadCategories().subscribe()
	}

	onEdit(category: Category): void {
		this.editingCategory.set(category)
		this.categoriesForm()?.fillForm(category)
	}

	onEditDone(): void {
		this.editingCategory.set(null)
	}
}
