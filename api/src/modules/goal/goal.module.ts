import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/infrastructure/db/prisma.module'
import { GoalController } from './goal.controller'
import { GoalService } from './goal.service'
import { DeadlineService } from './helpers/deadline.helper'
import { HeatmapService } from './helpers/heatmap.helper'
import { SavingsService } from './helpers/savings.helper'

@Module({
	imports: [PrismaModule],
	controllers: [GoalController],
	providers: [GoalService, SavingsService, DeadlineService, HeatmapService],
})
export class GoalModule {}
