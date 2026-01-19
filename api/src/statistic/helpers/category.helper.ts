import { PrismaService } from 'src/db/prisma.service'
import { Type } from 'src/generated/prisma/enums'
import { CategoryBreakdownItem } from '../dtos/category-breakdown.dto'
import { NumberHelper } from './number.helper'

export class CategoryHelper {
	static async getCategoryBreakdown(
		prisma: PrismaService,
		filters: any,
		type: Type,
	): Promise<CategoryBreakdownItem[]> {
		const grouped = await prisma.transaction.groupBy({
			by: ['categoryId'],
			where: { ...filters, type },
			_sum: { amount: true },
			_count: true,
			orderBy: { _sum: { amount: 'desc' } },
		})

		const total = grouped.reduce(
			(sum, item) => sum + NumberHelper.toNumber(item._sum.amount),
			0,
		)

		const categoriesWithDetails = await Promise.all(
			grouped.map(async (item) => {
				const category = await prisma.category.findUnique({
					where: { id: item.categoryId },
					select: { title: true, icon: true, iconColor: true },
				})

				const amount = NumberHelper.toNumber(item._sum.amount)
				const percentage = total > 0 ? (amount / total) * 100 : 0

				return {
					categoryId: item.categoryId,
					categoryTitle: category?.title || 'Unknown',
					categoryIcon: category?.icon || '❓',
					categoryIconColor: category?.iconColor || '#1e40af',
					total: amount,
					percentage: NumberHelper.round(percentage, 2),
					transactionCount: item._count,
				}
			}),
		)

		return categoriesWithDetails
	}

	static async getTopExpenseCategories(
		prisma: PrismaService,
		filters: any,
		totalExpenses: number,
	): Promise<CategoryBreakdownItem[]> {
		const topCategories = await prisma.transaction.groupBy({
			by: ['categoryId'],
			where: { ...filters, type: Type.EXPENSE },
			_sum: { amount: true },
			_count: true,
			orderBy: { _sum: { amount: 'desc' } },
			take: 3,
		})

		const categoriesWithDetails = await Promise.all(
			topCategories.map(async (item) => {
				const category = await prisma.category.findUnique({
					where: { id: item.categoryId },
					select: { title: true, icon: true, iconColor: true },
				})

				const amount = NumberHelper.toNumber(item._sum.amount)
				const percentage =
					totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0

				return {
					categoryId: item.categoryId,
					categoryTitle: category?.title || 'Unknown',
					categoryIcon: category?.icon || '❓',
					categoryIconColor: category?.iconColor || '#1e40af',
					total: amount,
					percentage: NumberHelper.round(percentage, 2),
					transactionCount: item._count,
				}
			}),
		)

		return categoriesWithDetails
	}
}
