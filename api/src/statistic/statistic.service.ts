import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { Type } from 'src/generated/prisma/enums'
import { OverviewResponseDto } from './dtos/overview-response.dto'
import { QueryStatisticsDto } from './dtos/query-statistics.dto'
import { CategoryHelper } from './helpers/category.helper'
import { NumberHelper } from './helpers/number.helper'
import { TransactionFiltersHelper } from './helpers/transaction-filters.helper'

@Injectable()
export class StatisticService {
	constructor(private prisma: PrismaService) {}

	async getOverview(
		userId: string,
		query: QueryStatisticsDto,
	): Promise<OverviewResponseDto> {
		// build filters
		const filters = TransactionFiltersHelper.buildFilters(userId, query)

		// get expenses stats
		const expenseStats = await this.prisma.transaction.aggregate({
			where: {
				...filters,
				type: Type.EXPENSE,
			},
			_sum: { amount: true },
			_count: true,
			_avg: { amount: true },
		})

		// get incomes stats
		const incomeStats = await this.prisma.transaction.aggregate({
			where: {
				...filters,
				type: Type.INCOME,
			},
			_sum: { amount: true },
			_count: true,
			_avg: { amount: true },
		})

		// decimal to numer
		const totalExpenses = NumberHelper.toNumber(expenseStats._sum.amount)
		const totalIncome = NumberHelper.toNumber(incomeStats._sum.amount)
		const averageExpense = NumberHelper.toNumber(expenseStats._avg.amount)
		const averageIncome = NumberHelper.toNumber(incomeStats._avg.amount)

		// get top 3 categories
		const topExpenseCategories = await CategoryHelper.getTopExpenseCategories(
			this.prisma,
			filters,
			totalExpenses,
		)

		return {
			totalExpenses,
			totalIncome,
			balance: totalIncome - totalExpenses,
			transactionCount: expenseStats._count + incomeStats._count,
			expenseCount: expenseStats._count,
			incomeCount: incomeStats._count,
			averageExpense,
			averageIncome,
			topExpenseCategories,
		}
	}
}
