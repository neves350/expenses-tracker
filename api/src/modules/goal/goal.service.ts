import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/db/prisma.service'
import { CreateGoalDto } from './dtos/create-goal.dto'
import { UpdateGoalDto } from './dtos/update-goal.dto'
import { DeadlinePreset } from './enums/deadline-preset.enum'
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

	async update(userId: string, id: string, dto: UpdateGoalDto) {
		const goal = await this.prisma.goal.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!goal) throw new BadRequestException('Goal not found')

		if (Object.keys(dto).length === 0)
			throw new BadRequestException('No data provided for update')

		const updateData: any = {}

		if (dto.title) {
			updateData.title = dto.title
		}

		if (dto.amount) {
			updateData.amount = dto.amount
		}

		// recalcuate if deadline changes
		if (dto.deadlinePreset || dto.customDeadline) {
			updateData.deadline = this.deadlineService.calculateDeadline(
				dto.deadlinePreset || DeadlinePreset.ONE_MONTH,
				dto.customDeadline,
			)
		}

		if (Object.keys(updateData).length === 0)
			throw new BadRequestException('No valid data provided for update')

		const updatedGoal = await this.prisma.goal.update({
			where: {
				id,
			},
			data: updateData,
		})

		const currentAmount = Number(updatedGoal.currentAmount)
		const targetAmount = Number(updatedGoal.amount)
		const remainingAmount = targetAmount - currentAmount

		return {
			...updatedGoal,
			amount: targetAmount,
			currentAmount: currentAmount,
			progress: Number(((currentAmount / targetAmount) * 100).toFixed(2)),
			savingsBreakdown:
				remainingAmount > 0
					? this.savingsService.calculateSavingsBreakdown(
							remainingAmount,
							updatedGoal.deadline,
						)
					: null,
		}
	}

	async delete(userId: string, id: string) {
		const goal = await this.prisma.goal.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!goal) throw new BadRequestException('Goal not found')

		await this.prisma.goal.delete({
			where: {
				id,
			},
		})

		return {
			id,
			message: 'Goal deleted successfully',
		}
	}

	async addDeposit(userId: string, goalId: string, amount: number) {
		const goal = await this.prisma.goal.findFirst({
			where: {
				id: goalId,
				userId,
			},
		})

		if (!goal) throw new BadRequestException('Goal not found')

		const currentAmount = Number(goal.currentAmount)
		const targetAmount = Number(goal.amount)

		// check if user get the goal
		if (currentAmount >= targetAmount) {
			throw new BadRequestException('Goal already completed')
		}

		// previne to pass the goal
		const newTotal = currentAmount + amount
		const actualDeposit =
			newTotal > targetAmount ? targetAmount - currentAmount : amount

		const [deposit, updatedGoal] = await this.prisma.$transaction([
			this.prisma.deposit.create({
				data: {
					amount: actualDeposit,
					goalId,
				},
			}),
			this.prisma.goal.update({
				where: {
					id: goalId,
				},
				data: {
					currentAmount: {
						increment: actualDeposit,
					},
				},
			}),
		])

		const finalAmount = Number(updatedGoal.currentAmount)
		const finalTarget = Number(updatedGoal.amount)

		return {
			deposit: {
				...deposit,
				amount: Number(deposit.amount),
			},
			goal: {
				...updatedGoal,
				amount: finalTarget,
				currentAmount: finalAmount,
				progress: Number(((finalAmount / finalTarget) * 100).toFixed(2)),
				isCompleted: finalAmount >= finalTarget,
			},
			message:
				finalAmount >= finalTarget
					? '🎉 Goal completed!'
					: 'Deposit added successfully',
		}
	}

	async getDeposits(userId: string, goalId: string) {
		const goal = await this.prisma.goal.findFirst({
			where: {
				id: goalId,
				userId,
			},
		})

		if (!goal) throw new BadRequestException('Goal not found')

		const deposits = await this.prisma.deposit.findMany({
			where: {
				goalId,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return {
			goalId,
			totalDeposits: deposits.length,
			totalAmount: deposits.reduce((sum, d) => sum + Number(d.amount), 0),
			deposits: deposits.map((d) => ({
				...d,
				amount: Number(d.amount),
			})),
		}
	}
}
