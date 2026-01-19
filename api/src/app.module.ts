import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './infrastructure/db/prisma.module'
import { MailModule } from './infrastructure/mail/mail.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoryModule } from './modules/category/category.module'
import { ExportModule } from './modules/export/export.module'
import { GoalModule } from './modules/goal/goal.module'
import { StatisticModule } from './modules/statistic/statistic.module'
import { TransactionModule } from './modules/transaction/transaction.module'
import { UsersModule } from './modules/users/users.module'
import { WalletModule } from './modules/wallet/wallet.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
		AuthModule,
		UsersModule,
		PrismaModule,
		MailModule,
		WalletModule,
		CategoryModule,
		TransactionModule,
		StatisticModule,
		ExportModule,
		GoalModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
