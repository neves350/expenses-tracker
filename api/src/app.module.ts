import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './db/prisma.module'
import { MailModule } from './mail/mail.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
		AuthModule,
		UsersModule,
		PrismaModule,
		MailModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
