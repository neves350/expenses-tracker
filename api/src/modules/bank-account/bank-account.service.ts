import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateBankAccountDto } from './dtos/create-bank-account.dto'

@Injectable()
export class BankAccountService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateBankAccountDto, userId: string) {
		const { name, type, currency, balance } = data

		const bankAccount = this.prisma.bankAccount.create({
			data: {
				name,
				type,
				currency,
				balance,
				userId,
			},
		})

		return bankAccount
	}

	async findAll(userId: string) {
		return this.prisma.bankAccount.findMany({
			where: {
				userId,
			},
		})
	}

	async findOne(cardId: string, userId: string) {
		const bankAccount = await this.prisma.bankAccount.findFirst({
			where: {
				id: cardId,
				userId,
			},
		})

		if (!bankAccount) throw new NotFoundException('Bank account not found')

		return bankAccount
	}
}
