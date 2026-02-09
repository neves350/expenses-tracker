import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { Prisma, type Transaction } from 'src/generated/prisma/client'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateTransactionDto } from './dtos/create-transaction.dto'
import { PaginatedResult } from './dtos/paginated-result.dto'
import { QueryTransactionDto } from './dtos/query-transaction.dto'
import { UpdateTransactionDto } from './dtos/update-transaction.dto'

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateTransactionDto, userId: string) {
		const { title, type, date, cardId, categoryId } = dto

		// validate amount > 0
		if (dto.amount <= 0)
			throw new BadRequestException('Amount must be greater than 0')

		// validate date is not in the future
		if (new Date(date) > new Date())
			throw new BadRequestException('Date cannot be in the future')

		// converts number to decimal
		const amount = new Prisma.Decimal(dto.amount)

		// validate user card
		const card = await this.prisma.card.findFirst({
			where: { id: cardId, userId },
			select: { id: true },
		})

		if (!card) throw new ForbiddenException('Card does not belong to user')

		// validate category
		const category = await this.prisma.category.findFirst({
			where: {
				id: categoryId,
				OR: [{ isDefault: true }, { userId: userId }],
			},
			select: { id: true },
		})

		if (!category) throw new NotFoundException('Category not found')

		return this.prisma.transaction.create({
			data: {
				title,
				type,
				amount,
				date,
				card: { connect: { id: cardId } },
				category: { connect: { id: categoryId } },
			},
		})
	}

	async findAll(
		dto: QueryTransactionDto,
		userId: string,
	): Promise<PaginatedResult<Transaction>> {
		const {
			cardId,
			accountId,
			categoryId,
			type,
			startDate,
			endDate,
			page = 1,
			limit = 20,
		} = dto

		// search for user cards
		const userCards = await this.prisma.card.findMany({
			where: { userId },
			select: { id: true },
		})

		// handle edge case when user has no cards
		if (userCards.length === 0) {
			return {
				data: [],
				meta: {
					total: 0,
					lastPage: 0,
					currentPage: page,
					perPage: limit,
					prev: null,
					next: null,
				},
			}
		}

		const cardIds = userCards.map((card) => card.id)

		// builds dynamically filter
		const where: Prisma.TransactionWhereInput = { cardId: { in: cardIds } }

		if (cardId) where.cardId = cardId
		if (categoryId) where.categoryId = categoryId
		if (type) where.type = type
		if (accountId) where.bankAccountId = accountId

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
			include: {
				card: {
					select: { id: true, name: true },
				},
				category: {
					select: { id: true, title: true, type: true },
				},
			},
		})

		// calculate metadata
		// Math.ceil() -> rounds a given number up to the nearest integer
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

	async findOne(transactionId: string, userId: string) {
		const userCards = await this.prisma.card.findMany({
			where: { userId },
			select: { id: true },
		})

		const cardIds = userCards.map((c) => c.id)

		const transaction = await this.prisma.transaction.findFirst({
			where: {
				id: transactionId,
				cardId: { in: cardIds },
			},
			include: {
				card: {
					select: { id: true, name: true },
				},
				category: {
					select: { id: true, title: true, type: true },
				},
			},
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		return transaction
	}

	async update(
		transactionId: string,
		userId: string,
		dto: UpdateTransactionDto,
	) {
		// validate card belongs to user
		const card = await this.prisma.card.findFirst({
			where: { id: dto.cardId, userId },
			select: { id: true },
		})

		if (!card) throw new ForbiddenException('Card does not belong to user')

		const transaction = await this.prisma.transaction.findFirst({
			where: { id: transactionId, cardId: { in: [card.id] } },
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		const amount = dto.amount ? new Prisma.Decimal(dto.amount) : undefined

		return this.prisma.transaction.update({
			where: { id: transactionId },
			data: {
				...dto,
				amount,
			},
		})
	}

	async delete(transactionId: string, userId: string) {
		const transaction = await this.prisma.transaction.findFirst({
			where: { id: transactionId },
			include: {
				card: {
					select: { id: true, userId: true },
				},
			},
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		if (transaction.card.userId !== userId)
			throw new ForbiddenException('You cannot delete this transaction')

		await this.prisma.transaction.delete({
			where: { id: transactionId },
		})

		return { message: 'Transaction deleted successfully' }
	}
}
