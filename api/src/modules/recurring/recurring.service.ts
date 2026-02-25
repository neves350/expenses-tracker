import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { Prisma } from 'src/generated/prisma/client'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateRecurringDto } from './dtos/create-recurring.dto'

@Injectable()
export class RecurringService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateRecurringDto, userId: string) {
		const {
			type,
			description,
			monthDay,
			frequency,
			categoryId,
			paymentMethod,
			cardId,
			bankAccountId,
			startDate,
			endDate,
		} = dto

		if (dto.amount <= 0)
			throw new BadRequestException('Amount must be greater than 0')
		const amount = new Prisma.Decimal(dto.amount)

		const card = await this.prisma.card.findFirst({
			where: { id: cardId, userId },
			select: { id: true },
		})

		if (!card) throw new ForbiddenException('Card does not belong to user')

		const category = await this.prisma.category.findFirst({
			where: {
				id: categoryId,
				OR: [{ isDefault: true }, { userId }],
			},
			select: { id: true },
		})

		if (!category) throw new ForbiddenException('Category not found')

		const bankAccount = await this.prisma.bankAccount.findFirst({
			where: { id: bankAccountId, userId },
			select: { id: true },
		})

		if (!bankAccount) throw new ForbiddenException('Account not found')

		return this.prisma.recurring.create({
			data: {
				type,
				description,
				amount,
				monthDay,
				frequency,
				paymentMethod,
				...(cardId && { card: { connect: { id: cardId } } }),
				bankAccount: { connect: { id: bankAccountId } },
				category: { connect: { id: categoryId } },
				startDate,
				endDate,
			},
		})
	}
}
