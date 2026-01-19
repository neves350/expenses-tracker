import { QueryStatisticsDto } from '../dtos/query-statistics.dto'

export class TransactionFiltersHelper {
	/**
	 * @param userId
	 * @param query
	 * @returns Objeto WHERE para usar no Prisma
	 */
	static buildFilters(userId: string, query: QueryStatisticsDto) {
		// base filters for wallet transactions
		const filters: any = {
			wallet: {
				userId,
			},
		}

		// optional filter
		if (query.walletId) {
			filters.walletId = query.walletId
		}

		// optional filter
		if (query.startDate || query.endDate) {
			filters.date = {}

			if (query.startDate) {
				// >= startDate (start day)
				filters.date.gte = new Date(query.startDate)
			}

			if (query.endDate) {
				// < endDate + 1 day (to include the entire day up to 23:59:59)
				const endDate = new Date(query.endDate)
				endDate.setDate(endDate.getDate() + 1)
				filters.date.lt = endDate
			}
		}

		return filters
	}
}
