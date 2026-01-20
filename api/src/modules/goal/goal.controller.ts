import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateGoalDto } from './dtos/create-goal.dto'
import { GoalService } from './goal.service'

@ApiTags('Goals')
@Controller('goals')
export class GoalController {
	constructor(private readonly goalService: GoalService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new goal',
		description:
			'Creates a savings goal with automatic calculation of required savings',
	})
	async create(@CurrentUser() user, @Body() dto: CreateGoalDto) {
		const goal = await this.goalService.create(user.userId, dto)

		return {
			goal,
			message: 'Goal created successfull',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all goals with progress',
	})
	async findAll(@CurrentUser() user) {
		return this.goalService.findAll(user.userId)
	}
}
