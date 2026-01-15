import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { CreateCategory } from './dtos/create-category.dto'
import type { CategoryType } from './dtos/query-category.dto'

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createCategory: CreateCategory, userId: string) {
		const { title, icon, iconColor, type } = createCategory

		// create category
		const category = this.prisma.category.create({
			data: {
				title,
				icon,
				iconColor,
				type,
				isDefault: false,
				userId,
			},
		})

		return category
	}

	async findAll(userId: string, type?: CategoryType) {
		return this.prisma.category.findMany({
			where: {
				OR: [
					{ userId: null }, // default categories
					{ userId }, // custom categories
				],
				...(type && { type }), // add filter if exists
			},
		})
	}
}
