import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateRecurringDto } from './dtos/create-recurring.dto'
import { RecurringService } from './recurring.service'

@ApiTags('Recurrings')
@Controller('recurring')
export class RecurringController {
	constructor(private readonly recurringService: RecurringService) {}

	@UseGuards(JwtAuthGuard)
	@Post('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new recurring transaction',
		description:
			'Creates a new recurring transaction with description, amount, type, date.',
	})
	async create(@Body() dto: CreateRecurringDto, @CurrentUser() user) {
		const recurring = await this.recurringService.create(dto, user.userId)

		return {
			recurring,
			message: 'Recurring transaction create successfull',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Geat all recurring transactions',
		description: 'Get all recurring transactions.',
	})
	async findAll(@CurrentUser() user) {
		return this.recurringService.findAll(user.userId)
	}
}
