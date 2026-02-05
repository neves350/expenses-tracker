import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
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
		summary: 'Create a new bank account',
		description:
			'Creates a new bank account with name, type, currency and balance.',
	})
	async transfer(@Body() data: TransferDto, @CurrentUser() user) {
		const transfer = await this.transferService.transfer(user.userId, data)

		return {
			transfer,
			message: 'Transfer created successfull',
		}
	}
}
