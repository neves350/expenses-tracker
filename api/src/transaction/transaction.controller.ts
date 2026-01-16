import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CreateTransactionDto } from './dtos/create-transaction.dto'
import { TransactionService } from './transaction.service'

@ApiTags('Transactions')
@Controller('')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@UseGuards(JwtAuthGuard)
	@Post('transactions')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new transaction',
		description: 'Creates a new transaction with title, type, amount and date.',
	})
	async create(
		@Body() createTransactionDto: CreateTransactionDto,
		@CurrentUser() user,
	) {
		const transaction = await this.transactionService.create(
			createTransactionDto,
			user.userId,
		)

		return {
			transaction,
			message: 'Transaction created successfull',
		}
	}
}
