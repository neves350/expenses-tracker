import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Module({
	providers: [PrismaService],
	imports: [],
	exports: [PrismaService],
})
export class PrismaModule {}
