import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'
import { CategoryService } from './helpers/category.helper'
import { TransactionFiltersService } from './helpers/transaction-filters.helper'
import { StatisticController } from './statistic.controller'
import { StatisticService } from './statistic.service'

@Module({
	imports: [PrismaModule],
	controllers: [StatisticController],
	providers: [StatisticService, TransactionFiltersService, CategoryService],
})
export class StatisticModule {}
