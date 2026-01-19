import { Injectable } from '@nestjs/common'
import * as Papa from 'papaparse'
import { PrismaService } from 'src/db/prisma.service'
import { ExportTransactionsQueryDto } from './dtos/export-transactions-query.dto'
import { CsvTransformerHelper } from './helpers/csv-transformer.helper'
import { TransactionQueryHelper } from './helpers/transaction-query.helper'

@Injectable()
export class ExportService {
	constructor(private readonly prisma: PrismaService) {}

	async exportTransactionToCsv(
		userId: string,
		query: ExportTransactionsQueryDto,
	): Promise<string> {
		// filters
		const filters = TransactionQueryHelper.buildTransactionFilters(userId, {
			walletId: query.walletId,
			type: query.type,
			startDate: query.startDate,
			endDate: query.endDate,
		})

		// get transactions
		const transactions = await this.prisma.transaction.findMany({
			where: filters,
			include: {
				category: {
					select: {
						title: true,
					},
				},
				wallet: {
					select: {
						name: true,
					},
				},
			},
			orderBy: {
				date: 'desc', // recent first
			},
		})

		// transform into csv format
		const csvData =
			CsvTransformerHelper.transformTransactionsToCSV(transactions)

		// generate csv
		const csv = Papa.unparse(csvData, {
			header: true,
			delimiter: ',',
		})

		return csv
	}
}
