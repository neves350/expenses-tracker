import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { Prisma, type Transaction } from 'src/generated/prisma/client'
import { CreateTransactionDto } from './dtos/create-transaction.dto'
import { PaginatedResult } from './dtos/paginated-result.dto'
import { QueryTransactionDto } from './dtos/query-transaction.dto'
import { UpdateTransactionDto } from './dtos/update-transaction.dto'

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateTransactionDto, userId: string) {
		const { title, type, date, walletId, categoryId } = dto

		// converts number to decimal
		const amount = new Prisma.Decimal(dto.amount)

		// calculate new balance
		// transaction = income, balance increase
		// transaction = expense, balance decrease
		const delta = type === 'INCOME' ? amount : amount.negated()

		return this.prisma.$transaction(async (tx) => {
			// validate user wallet
			const wallet = await tx.wallet.findFirst({
				where: { id: walletId, userId },
				select: { id: true, balance: true },
			})

			if (!wallet)
				throw new ForbiddenException('Wallet does not belong to user')

			// validate category
			const category = await tx.category.findFirst({
				where: {
					id: categoryId,
					OR: [{ isDefault: true }, { userId: userId }],
				},
				select: { id: true },
			})

			if (!category) throw new NotFoundException('Category not found')

			const transaction = await tx.transaction.create({
				data: {
					title,
					type,
					amount,
					date,
					wallet: { connect: { id: walletId } },
					category: { connect: { id: categoryId } },
				},
			})

			// update wallet balance
			await tx.wallet.update({
				where: { id: walletId },
				data: {
					balance: { increment: delta },
				},
			})

			return transaction
		})
	}

	async findAll(
		dto: QueryTransactionDto,
		userId: string,
	): Promise<PaginatedResult<Transaction>> {
		const {
			walletId,
			categoryId,
			type,
			startDate,
			endDate,
			page = 1,
			limit = 20,
		} = dto

		// search for user wallets
		const userWallets = await this.prisma.wallet.findMany({
			where: { userId },
			select: { id: true },
		})

		const walletIds = userWallets.map((wallet) => wallet.id)

		// builds dynamically filter
		const where: any = { walletId: { in: walletIds } }

		if (walletId) where.walletId = walletId
		if (categoryId) where.categoryId = categoryId
		if (type) where.type = type

		// date filters
		if (startDate || endDate) {
			where.date = {}
			if (startDate) where.date.gte = new Date(startDate) // greater than or equal
			if (endDate) where.date.lte = new Date(endDate) // less than or equal
		}

		// count total of register for pagination
		const total = await this.prisma.transaction.count({ where })

		// find data for pagination
		const data = await this.prisma.transaction.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { date: 'desc' },
		})

		// calculate metadata
		// Math.ceil() -> rounds a givem number op to the nearest integer
		const lastPage = Math.ceil(total / limit)
		const prev = page > 1 ? page - 1 : null
		const next = page < lastPage ? page + 1 : null

		return {
			data,
			meta: {
				total,
				lastPage,
				currentPage: page,
				perPage: limit,
				prev,
				next,
			},
		}
	}

	async findOne(transactionId: string, walletId: string) {
		const transaction = await this.prisma.transaction.findFirst({
			where: {
				id: transactionId,
				walletId,
			},
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		return transaction
	}

	async update(
		transactionId: string,
		_userId: string,
		dto: UpdateTransactionDto,
	) {
		const amount = new Prisma.Decimal(dto.amount)

		const delta = dto.type === 'INCOME' ? amount : amount.negated()

		return this.prisma.$transaction(async (tx) => {
			const transaction = await tx.transaction.findFirst({
				where: {
					id: transactionId,
				},
			})

			if (!transaction) throw new NotFoundException('Transaction not found')

			const updatedTransaction = await tx.transaction.update({
				where: { id: transactionId },
				data: dto,
			})

			await tx.wallet.update({
				where: {
					id: dto.walletId,
				},
				data: {
					balance: {
						increment: delta,
					},
				},
			})

			return updatedTransaction
		})
	}

	async delete(transactionId: string, userId: string) {
		return this.prisma.$transaction(async (tx) => {
			const transaction = await tx.transaction.findFirst({
				where: { id: transactionId },
				include: {
					wallet: {
						select: { id: true, userId: true, balance: true },
					},
				},
			})

			if (!transaction) throw new NotFoundException('Transaction not found')

			if (transaction.wallet.userId !== userId)
				throw new ForbiddenException('You cannot delete this transaction')

			const delta =
				transaction.type === 'INCOME'
					? transaction.amount.negated()
					: transaction.amount

			await tx.wallet.update({
				where: { id: transaction.walletId },
				data: {
					balance: { increment: delta },
				},
			})

			await tx.transaction.delete({
				where: { id: transactionId },
			})

			return { message: 'Transaction deleted successfully' }
		})
	}
}
