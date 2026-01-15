import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
	imports: [PrismaModule],
	controllers: [WalletController],
	providers: [WalletService],
})
export class WalletModule {}
