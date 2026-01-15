import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CreateWalletDto } from './dtos/create-wallet.dto'
import { WalletService } from './wallet.service'

@ApiTags('Wallets')
@Controller()
export class WalletController {
	constructor(readonly walletService: WalletService) {}

	@UseGuards(JwtAuthGuard)
	@Post('wallets')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new wallet',
		description: 'Creates a new wallet with name, type, curreny and balance.',
	})
	async create(@Body() createWalletDto: CreateWalletDto, @CurrentUser() user) {
		const wallet = await this.walletService.create(createWalletDto, user.userId)

		return {
			wallet,
			message: 'Wallet created successfull',
		}
	}
}
