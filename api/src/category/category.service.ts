import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { CreateCategory } from './dtos/create-category.dto'
import type { CategoryType } from './dtos/query-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'

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

	async findOne(categoryId: string, userId: string) {
		const category = await this.prisma.category.findFirst({
			where: {
				id: categoryId,
				userId,
			},
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async update(
		categoryId: string,
		userId: string,
		updateCategoryDto: UpdateCategoryDto,
	) {
		// check if category is own userId
		const category = await this.prisma.category.findFirst({
			where: {
				id: categoryId,
			},
		})

		if (!category) throw new NotFoundException('Category not found')

		if (category.userId === null)
			throw new ForbiddenException('Cannot edit default categories')

		if (category.userId !== userId)
			throw new ForbiddenException('You can only edit your own categories')

		// update category
		const updatedCategory = await this.prisma.category.update({
			where: {
				id: categoryId,
			},
			data: updateCategoryDto,
		})

		return updatedCategory
	}
}
