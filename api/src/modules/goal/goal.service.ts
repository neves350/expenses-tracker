import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateGoalDto, DeadlinePreset } from './dtos/create-goal.dto'
import { DeadlineService } from './helpers/deadline.helper'
import { SavingsService } from './helpers/savings.helper'

@Injectable()
export class GoalService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly deadlineService: DeadlineService,
		private readonly savingsService: SavingsService,
	) {}
	async create(userId: string, dto: CreateGoalDto) {
		const { title, amount, customDeadline, deadlinePreset } = dto

		const deadline = this.deadlineService.calculateDeadline(
			deadlinePreset || DeadlinePreset.ONE_MONTH,
			customDeadline,
		)

		const savingsBreakdown = this.savingsService.calculateSavingsBreakdown(
			amount,
			deadline,
		)

		const goal = await this.prisma.goal.create({
			data: {
				title,
				amount,
				deadline,
				userId,
			},
		})

		return {
			...goal,
			savingsBreakdown,
		}
	}
}
