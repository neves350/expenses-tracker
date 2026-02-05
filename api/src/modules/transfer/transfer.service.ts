import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { TransferDto } from './dtos/transfer.dto'

@Injectable()
export class TransferService {
	constructor(private readonly prisma: PrismaService) {}

	async transfer(userId: string, data: TransferDto) {
		const { amount, fromAccountId, toAccountId, date, description } = data

		// verify ownership
		const [fromAccount, toAccount] = await Promise.all([
			this.prisma.bankAccount.findFirst({
				where: {
					id: fromAccountId,
					userId,
				},
			}),
			this.prisma.bankAccount.findFirst({
				where: {
					id: toAccountId,
					userId,
				},
			}),
		])

		if (!fromAccount) throw new NotFoundException('Source account not found')

		if (!toAccount) throw new NotFoundException('Destination account not found')

		// validate currency
		if (fromAccount.currency !== toAccount.currency)
			throw new BadRequestException(
				'Transfers between accounts with different currencies are not supported',
			)

		// check's for positive balance
		const fromBalance = Number(fromAccount.balance)
		if (fromBalance < amount)
			throw new BadRequestException(
				`Insufficient balance. Available: ${fromBalance}, Requested: ${amount}`,
			)

		// check's current day or future date
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const transferDate = new Date(date)
		transferDate.setHours(0, 0, 0, 0)

		const isScheduled = transferDate > today

		if (isScheduled) {
			// pending status
			const transfer = await this.prisma.transfer.create({
				data: {
					amount,
					fromAccountId,
					toAccountId,
					date,
					description,
					userId,
					status: 'PENDING',
				},
			})
			return {
				transfer,
				message: 'Transfer scheduled successfully.',
			}
		}

		// completed status
		const [transfer] = await this.prisma.$transaction([
			this.prisma.transfer.create({
				data: {
					amount,
					fromAccountId,
					toAccountId,
					date,
					description,
					userId,
					status: 'COMPLETED',
					executedAt: new Date(),
				},
			}),
			this.prisma.bankAccount.update({
				where: {
					id: fromAccountId,
				},
				data: {
					balance: {
						decrement: amount,
					},
				},
			}),
			this.prisma.bankAccount.update({
				where: {
					id: toAccountId,
				},
				data: {
					balance: {
						increment: amount,
					},
				},
			}),
		])

		return {
			transfer,
			message: 'Transfer completed successfully',
		}
	}
}
