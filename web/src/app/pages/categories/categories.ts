import { Component, inject, type OnInit } from '@angular/core'
import { CategoriesService } from '@core/services/categories.service'

@Component({
	selector: 'app-categories',
	imports: [],
	templateUrl: './categories.html',
})
export class Categories implements OnInit {
	private readonly categoriesService = inject(CategoriesService)

	readonly categories = this.categoriesService.categories
	readonly loading = this.categoriesService.loading

	ngOnInit(): void {
		this.categoriesService.loadCategories().subscribe()
	}
}
