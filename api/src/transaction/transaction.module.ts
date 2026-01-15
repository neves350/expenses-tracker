import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
	imports: [PrismaModule],
	controllers: [TransactionController],
	providers: [TransactionService],
})
export class TransactionModule {}
