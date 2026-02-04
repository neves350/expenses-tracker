import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateBankAccountDto } from './dtos/create-bank-account.dto'
import type { UpdateBankAccountDto } from './dtos/update-bank-account.dto'

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
		const [bankAccounts, aggregation] = await Promise.all([
			this.prisma.bankAccount.findMany({
				where: { userId },
			}),
			this.prisma.bankAccount.aggregate({
				where: {
					userId,
				},
				_sum: {
					balance: true,
				},
				_count: {
					id: true,
				},
			}),
		])

		return {
			data: bankAccounts,
			total: aggregation._sum.balance ?? 0,
			count: aggregation._count.id,
		}
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

	async update(
		bankAccountId: string,
		userId: string,
		data: UpdateBankAccountDto,
	) {
		const bankAccount = await this.prisma.bankAccount.findFirst({
			where: {
				id: bankAccountId,
				userId,
			},
		})

		if (!bankAccount) throw new NotFoundException('Bank account not found')

		const updatedBankAccount = await this.prisma.bankAccount.update({
			where: {
				id: bankAccountId,
			},
			data,
		})

		return updatedBankAccount
	}

	async delete(id: string) {
		await this.prisma.bankAccount.delete({
			where: { id },
		})

		return {
			message: 'Bank account deleted successfully',
			success: true,
		}
	}
}
