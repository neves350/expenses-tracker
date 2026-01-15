import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { CreateWalletDto } from './dtos/create-wallet.dto'
import { UpdateWalletDto } from './dtos/update-wallet.dto'

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

	async updateById(
		walletId: string,
		userId: string,
		updateWalletDto: UpdateWalletDto,
	) {
		// check if wallet is own userId
		const wallet = await this.prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId,
			},
		})

		if (!wallet) throw new NotFoundException('Wallet not found')

		// update wallet
		const updatedWallet = await this.prisma.wallet.update({
			where: {
				id: walletId,
			},
			data: updateWalletDto,
		})

		return updatedWallet
	}

	async delete(id: string) {
		await this.prisma.wallet.delete({
			where: { id },
		})

		return {
			message: 'Wallet deleted successfully',
			success: true,
		}
	}
}
