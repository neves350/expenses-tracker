import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateGoalDto, DeadlinePreset } from './dtos/create-goal.dto'
import { DeadlineService } from './helpers/deadline.helper'
import { HeatmapService } from './helpers/heatmap.helper'
import { SavingsService } from './helpers/savings.helper'

@Injectable()
export class GoalService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly deadlineService: DeadlineService,
		private readonly savingsService: SavingsService,
		private readonly heatmapService: HeatmapService,
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

	async findAll(userId: string) {
		const goals = this.prisma.goal.findMany({
			where: {
				userId,
			},
			include: {
				_count: {
					select: {
						deposits: true,
					},
				},
			},
		})

		return (await goals).map((goal) => {
			// convert to number
			const currentAmount = Number(goal.currentAmount)
			const targetAmount = Number(goal.amount)

			return {
				...goal,
				amount: targetAmount,
				currentAmount: currentAmount,
				progress: Number(((currentAmount / targetAmount) * 100).toFixed(2)),
				isCompleted: currentAmount >= targetAmount,
			}
		})
	}

	async findOne(userId: string, id: string) {
		const goal = await this.prisma.goal.findFirst({
			where: {
				id,
				userId,
			},
			include: {
				deposits: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		})

		if (!goal) throw new BadRequestException('Goal not found')

		const currentAmount = Number(goal.currentAmount)
		const targetAmount = Number(goal.amount)
		const remainingAmount = targetAmount - currentAmount

		// generate heatmap data
		const heatmapData = this.heatmapService.generateHeatmap(
			goal.deposits,
			goal.deadline,
		)

		return {
			...goal,
			amount: targetAmount,
			currentAmount: currentAmount,
			progress: Number(((currentAmount / targetAmount) * 100).toFixed(2)),
			isCompleted: currentAmount >= targetAmount,
			savingsBreakdown:
				remainingAmount > 0
					? this.savingsService.calculateSavingsBreakdown(
							remainingAmount,
							goal.deadline,
						)
					: null,
			heatmap: heatmapData,
		}
	}
}
