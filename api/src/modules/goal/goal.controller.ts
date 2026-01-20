import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateDepositDto } from './dtos/create-deposit.dto'
import { CreateGoalDto } from './dtos/create-goal.dto'
import { UpdateGoalDto } from './dtos/update-goal.dto'
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

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get goal details',
		description:
			'Returns detailed goal information including heatmap data for deposit visualization',
	})
	async findOne(@CurrentUser() user, @Param('id') id: string) {
		return this.goalService.findOne(user.userId, id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update a goal',
		description: 'Updates goal details and recalculates savings breakdown',
	})
	async update(
		@CurrentUser() user,
		@Param('id') id: string,
		@Body() dto: UpdateGoalDto,
	) {
		const goal = await this.goalService.update(user.userId, id, dto)

		return {
			goal,
			message: 'Goal updated successfull',
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete a goal',
		description: 'Permanently deletes a goal and all associated deposits',
	})
	async delete(@CurrentUser() user, @Param('id') id: string) {
		return this.goalService.delete(user.userId, id)
	}

	@UseGuards(JwtAuthGuard)
	@Post(':id/deposit')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Add deposit to goal',
		description:
			'Records a savings deposit and updates goal progress. Prevents exceeding target amount.',
	})
	async addDeposit(
		@CurrentUser() user,
		@Param('id') id: string,
		@Body() dto: CreateDepositDto,
	) {
		return this.goalService.addDeposit(user.userId, id, dto.amount)
	}
}
