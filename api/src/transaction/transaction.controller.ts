import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CreateTransactionDto } from './dtos/create-transaction.dto'
import { QueryTransactionDto } from './dtos/query-transaction.dto'
import { UpdateTransactionDto } from './dtos/update-transaction.dto'
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

	@UseGuards(JwtAuthGuard)
	@Get('transactions')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all transactions',
		description: 'Get all transactions with optional filters.',
	})
	async findAll(@Query() query: QueryTransactionDto, @CurrentUser() user) {
		return this.transactionService.findAll(query, user.userId)
	}

	@UseGuards(JwtAuthGuard)
	@Get('transactions/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get transaction by id',
		description: 'Get one transaction for the user.',
	})
	async findOne(@Param('id') id: string, @CurrentUser() user) {
		return this.transactionService.findOne(id, user.categoryId)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('transactions/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update transaction by id',
		description: 'Updates the transaction information.',
	})
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateTransactionDto,
		@CurrentUser() user,
	) {
		return this.transactionService.update(id, user.userId, dto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete('transactions/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete category by id',
		description: 'Deletes the category information.',
	})
	async delete(@Param('id') id: string, @CurrentUser() user) {
		return this.transactionService.delete(id, user.userId)
	}
}
