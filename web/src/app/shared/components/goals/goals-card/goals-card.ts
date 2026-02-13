import { DatePipe } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { Goal, GoalType } from '@core/api/goals.interface'
import { GoalsService } from '@core/services/goals.service'
import {
	BanknoteArrowDownIcon,
	EllipsisIcon,
	EyeIcon,
	HandCoinsIcon,
	LucideAngularModule,
	type LucideIconData,
	PlusIcon,
	SquarePenIcon,
	Trash2Icon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { lastValueFrom } from 'rxjs'
import { ZardBadgeComponent, type ZardBadgeVariants } from '../../ui/badge'
import { ZardButtonComponent } from '../../ui/button'
import { ZardDialogService } from '../../ui/dialog'
import { ZardDividerComponent } from '../../ui/divider'
import { ZardPopoverComponent, ZardPopoverDirective } from '../../ui/popover'
import { ZardProgressBarComponent } from '../../ui/progress-bar'
import { ZardSheetService } from '../../ui/sheet'
import { ZardTableCellComponent } from '../../ui/table'
import { GoalsDepositForm } from '../goals-deposit-form/goals-deposit-form'
import type { iDepositSheetData } from '../goals-deposit-form/goals-deposit-form.interface'
import { GoalsForm } from '../goals-form/goals-form'
import type { iGoalsData } from '../goals-form/goals-form.interface'

@Component({
	selector: 'tr[app-goals-card]',
	imports: [
		LucideAngularModule,
		ZardBadgeComponent,
		ZardButtonComponent,
		RouterLink,
		ZardTableCellComponent,
		ZardProgressBarComponent,
		ZardPopoverComponent,
		ZardPopoverDirective,
		ZardDividerComponent,
		DatePipe,
	],
	templateUrl: './goals-card.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsCard {
	private readonly dialogService = inject(ZardDialogService)
	private readonly sheetService = inject(ZardSheetService)
	private readonly goalsService = inject(GoalsService)

	readonly goal = input.required<Goal>()

	readonly EllipsisIcon = EllipsisIcon
	readonly SquarePenIcon = SquarePenIcon
	readonly Trash2Icon = Trash2Icon
	readonly EyeIcon = EyeIcon
	readonly PlusIcon = PlusIcon
	readonly HandCoinsIcon = HandCoinsIcon
	readonly BanknoteArrowDownIcon = BanknoteArrowDownIcon

	readonly goalIcon = computed(() => {
		const iconMap: Record<GoalType, { icon: LucideIconData; style: string }> = {
			[GoalType.SAVINGS]: {
				icon: this.HandCoinsIcon,
				style: 'bg-income text-income-foreground',
			},
			[GoalType.SPENDING_LIMIT]: {
				icon: this.BanknoteArrowDownIcon,
				style: 'bg-expense text-expense-foreground',
			},
		}
		return iconMap[this.goal().type]
	})

	readonly typeLabel = computed(() => {
		const goal = this.goal()
		const base = { SAVINGS: 'Savings', SPENDING_LIMIT: 'Spendings' }[goal.type]

		if (goal.type === GoalType.SAVINGS && goal.bankAccount) {
			return `Account: ${goal.bankAccount.name} • ${base}`
		}

		if (goal.type === GoalType.SPENDING_LIMIT && goal.category) {
			return `Category: ${goal.category.title} • ${base}`
		}

		return base
	})

	readonly typeLabelAmount = computed(
		() => ({ SAVINGS: 'Saved', SPENDING_LIMIT: 'Spent' })[this.goal().type],
	)

	readonly formattedAmount = computed(() => {
		const currency = this.goal().bankAccount?.currency ?? 'EUR'
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(this.goal().amount)
	})

	readonly formattedCurrentAmount = computed(() => {
		const currency = this.goal().bankAccount?.currency ?? 'EUR'
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(this.goal().currentAmount)
	})

	readonly paceBadge = computed(() => {
		const map: Record<
			string,
			{ type: ZardBadgeVariants['zType']; label: string; dot: string }
		> = {
			ON_TRACK: { type: 'success', label: 'On Track', dot: 'bg-green-500' },
			COMPLETED: { type: 'completed', label: 'Completed', dot: 'bg-teal-500' },
			OFF_PACE: { type: 'warning', label: 'Off Pace', dot: 'bg-yellow-500' },
			OVER_PACE: { type: 'destructive', label: 'Over Pace', dot: 'bg-white' },
		}
		return (
			map[this.goal().paceStatus] ?? {
				type: 'secondary',
				label: this.goal().paceStatus,
				dot: 'bg-green-500',
			}
		)
	})

	addDeposit() {
		this.dialogService.create({
			zTitle: 'Add Deposit',
			zContent: GoalsDepositForm,
			zWidth: '425px',
			zHideFooter: false,
			zOkText: 'Deposit',
			zOnOk: (instance: GoalsDepositForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
			zData: {
				id: this.goal().id,
				goal: this.goal(),
			} as iDepositSheetData,
		})
	}

	updateCard() {
		this.sheetService.create({
			zTitle: 'Edit Goal',
			zContent: GoalsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Save Changes',
			zOnOk: (instance: GoalsForm) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
			zData: {
				id: this.goal().id,
				title: this.goal().title,
				type: this.goal().type,
				amount: this.goal().amount,
				bankAccountId: this.goal().bankAccountId,
				categoryId: this.goal().categoryId,
				startDate: this.goal().startDate,
				endDate: this.goal().endDate,
			} as iGoalsData,
		})
	}

	deleteCard() {
		const goalId = this.goal().id
		if (!goalId) return

		return this.dialogService.create({
			zTitle: `Remove ${this.goal().title}?`,
			zDescription: 'This action cannot be undone.',
			zCancelText: 'Cancel',
			zOkText: 'Delete Goal',
			zOkDestructive: true,
			zOnOk: async () => {
				try {
					const message = await lastValueFrom(this.goalsService.delete(goalId))
					toast.success(message)
					this.goalsService.loadGoals().subscribe()
					return true
				} catch (err: unknown) {
					const error = err as { error?: { message?: string } }
					toast.error(error.error?.message || 'Failed to delete goal')
					return false
				}
			},
		})
	}
}
