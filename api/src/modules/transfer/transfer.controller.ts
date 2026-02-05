import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { QueryTransferDto } from './dtos/query-transfer.dto'
import { TransferDto } from './dtos/transfer.dto'
import { TransferService } from './transfer.service'

@ApiTags('Transfers')
@Controller('transfer')
export class TransferController {
	constructor(private readonly transferService: TransferService) {}

	@UseGuards(JwtAuthGuard)
	@Post('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new transfer',
		description:
			'Creates a new transfer for an account with amount, fromAccountId, toAccountId, date & description (optional).',
	})
	async transfer(@Body() data: TransferDto, @CurrentUser() user) {
		return this.transferService.transfer(user.userId, data)
	}

	@UseGuards(JwtAuthGuard)
	@Get('')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Find all transfers',
		description: 'Find all transfers for an account.',
	})
	async findAll(@CurrentUser() user, @Query() query: QueryTransferDto) {
		return this.transferService.findAll(user.userId, query)
	}
}
