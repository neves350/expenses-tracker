import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'
import { StatisticController } from './statistic.controller'
import { StatisticService } from './statistic.service'

@Module({
	imports: [PrismaModule],
	controllers: [StatisticController],
	providers: [StatisticService],
})
export class StatisticModule {}
