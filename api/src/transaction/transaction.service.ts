import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { Prisma } from 'src/generated/prisma/client'
import { CreateTransactionDto } from './dtos/create-transaction.dto'

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
			//
			const wallet = await tx.wallet.findFirst({
				where: { id: walletId, userId },
				select: { id: true, balance: true },
			})

			if (!wallet)
				throw new ForbiddenException('Wallet does not belong to user')

			//
			const category = await tx.category.findFirst({
				where: {
					id: categoryId,
					OR: [{ isDefault: true }, { userId: userId }],
				},
				select: { id: true },
			})

			if (!category) throw new NotFoundException('Category not found')

			const transaction = tx.transaction.create({
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
}
