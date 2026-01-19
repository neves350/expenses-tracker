import { Controller } from '@nestjs/common'
import { GoalService } from './goal.service'

@Controller('goal')
export class GoalController {
	constructor(readonly _goalService: GoalService) {}
}
