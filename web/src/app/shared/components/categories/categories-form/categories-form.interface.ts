import type { CategoryType } from '@core/api/categories.interface'

export interface iCategorySheetData {
	id?: string
	title?: string
	icon?: string
	type?: CategoryType
}
