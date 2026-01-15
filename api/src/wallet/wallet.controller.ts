import { Controller } from '@nestjs/common'
import { WalletService } from './wallet.service'

@Controller('wallet')
export class WalletController {
	constructor(readonly _walletService: WalletService) {}
}
