import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { CreateWalletDto } from './dtos/create-wallet.dto'

@Injectable()
export class WalletService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createWalletDto: CreateWalletDto, userId: string) {
		const { name, type, currency, balance } = createWalletDto

		const wallet = await this.prisma.wallet.create({
			data: {
				name,
				type,
				currency,
				balance,
				userId,
			},
		})

		return wallet
	}

	async findAll(userId: string) {
		return this.prisma.wallet.findMany({
			where: {
				userId,
			},
		})
	}

	async findOne(walletId: string, userId: string) {
		const wallet = await this.prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId,
			},
		})

		if (!wallet) throw new NotFoundException('Wallet not found')

		return wallet
	}
}
