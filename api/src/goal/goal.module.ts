import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'
import { GoalController } from './goal.controller'
import { GoalService } from './goal.service'

@Module({
	imports: [PrismaModule],
	controllers: [GoalController],
	providers: [GoalService],
})
export class GoalModule {}
