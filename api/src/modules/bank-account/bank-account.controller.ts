import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BankAccountService } from './bank-account.service'
import { CreateBankAccountDto } from './dtos/create-bank-account.dto'

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
}
