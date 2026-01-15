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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CreateWalletDto } from './dtos/create-wallet.dto'
import { UpdateWalletDto } from './dtos/update-wallet.dto'
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

	@UseGuards(JwtAuthGuard)
	@Get('wallets')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all wallets',
		description: 'Get all wallets from user.',
	})
	async findAll(@CurrentUser() user) {
		const wallets = await this.walletService.findAll(user.userId)

		return wallets
	}

	@UseGuards(JwtAuthGuard)
	@Get('wallets/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get wallet by id',
		description: 'Get wallet for the user.',
	})
	async findOne(@Param('id') id: string, @CurrentUser() user) {
		const wallet = await this.walletService.findOne(id, user.sub)

		return { wallet }
	}

	@UseGuards(JwtAuthGuard)
	@Patch('wallets/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update wallet by id',
		description: 'Updates the wallet information.',
	})
	async updateById(
		@Param('id') id: string,
		@Body() updateWalletDto: UpdateWalletDto,
		@CurrentUser() user,
	) {
		const updatedWallet = await this.walletService.updateById(
			id,
			user.sub,
			updateWalletDto,
		)

		return { updatedWallet }
	}

	@UseGuards(JwtAuthGuard)
	@Delete('wallets/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete wallet by id',
		description: 'Deletes the wallet information.',
	})
	async delete(@Param('id') id: string, @CurrentUser() _user) {
		return this.walletService.delete(id)
	}
}
