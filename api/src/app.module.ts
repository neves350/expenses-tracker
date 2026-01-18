import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './db/prisma.module'
import { MailModule } from './mail/mail.module'
import { UsersModule } from './users/users.module'
import { WalletModule } from './wallet/wallet.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { StatisticModule } from './statistic/statistic.module';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
