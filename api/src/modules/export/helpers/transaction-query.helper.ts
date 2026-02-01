import type { Type } from 'src/generated/prisma/enums'

export class TransactionQueryHelper {
	static buildTransactionFilters(
		userId: string,
		options: {
			cardId?: string
			type?: Type
			startDate?: string
			endDate?: string
		} = {},
	) {
		const filters: any = {
			card: {
				userId,
			},
		}

		if (options.cardId) {
			filters.cardId = options.cardId
		}

		if (options.type) {
			filters.type = options.type
		}

		if (options.startDate || options.endDate) {
			filters.date = {}

			if (options.startDate) {
				filters.date.gte = new Date(options.startDate)
			}

			if (options.endDate) {
				filters.date.lte = new Date(`${options.endDate}T23:59:59.999Z`)
			}
		}

		return filters
	}
}
