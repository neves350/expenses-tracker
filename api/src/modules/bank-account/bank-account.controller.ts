import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BankAccountService } from './bank-account.service'
import { CreateBankAccountDto } from './dtos/create-bank-account.dto'
import type { UpdateBankAccountDto } from './dtos/update-bank-account.dto'

@ApiTags('Bank Accounts')
@Controller('bank-account')
export class BankAccountController {
	constructor(readonly bankAccountService: BankAccountService) {}

	@UseGuards(JwtAuthGuard)
	@Post('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new bank account',
		description:
			'Creates a new bank account with name, type, currency and balance.',
	})
	async create(@Body() data: CreateBankAccountDto, @CurrentUser() user) {
		const bankAccount = await this.bankAccountService.create(data, user.userId)

		return {
			bankAccount,
			message: 'Bank account created successfull',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all bank accounts',
		description: 'Get all bank accounts from user.',
	})
	async findAll(@CurrentUser() user) {
		const bankAccounts = await this.bankAccountService.findAll(user.userId)

		return bankAccounts
	}

	@UseGuards(JwtAuthGuard)
	@Get('/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get bank account by id',
		description: 'Get bank account for the user.',
	})
	async findOne(@Param('id') id: string, @CurrentUser() user) {
		const card = await this.bankAccountService.findOne(id, user.userId)

		return { card }
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update bank account by id',
		description: 'Updates the bank account information.',
	})
	async update(
		@Param('id') id: string,
		@Body() data: UpdateBankAccountDto,
		@CurrentUser() user,
	) {
		const updatedBankAccount = await this.bankAccountService.update(
			id,
			user.userId,
			data,
		)

		return { updatedBankAccount }
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete bank account by id',
		description: 'Deletes the bank account information.',
	})
	async delete(@Param('id') id: string, @CurrentUser() user) {
		// Verify bank account ownership before deleting
		await this.bankAccountService.findOne(id, user.userId)
		return this.bankAccountService.delete(id)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id/balance-history')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get balance history',
		description: 'Get balance history on a 6 months period.',
	})
	async getBalanceHistory(@Param('id') id: string, @CurrentUser() user) {
		return this.bankAccountService.getBalanceHistory(id, user.userId)
	}
}
