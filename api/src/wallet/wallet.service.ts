import { Injectable } from '@nestjs/common'
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
}
