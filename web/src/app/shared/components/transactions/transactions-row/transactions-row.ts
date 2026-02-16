import { LowerCasePipe } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
} from '@angular/core'
import { Transaction } from '@core/api/transactions.interface'
import { TransactionsService } from '@core/services/transactions.service'
import {
	CircleCheckIcon,
	CircleXIcon,
	EllipsisIcon,
	FilesIcon,
	LucideAngularModule,
	SquarePenIcon,
	Trash2Icon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { lastValueFrom } from 'rxjs'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardButtonComponent } from '../../ui/button'
import { ZardDialogService } from '../../ui/dialog'
import { ZardDividerComponent } from '../../ui/divider'
import { ZardPopoverComponent, ZardPopoverDirective } from '../../ui/popover'
import { ZardSheetService } from '../../ui/sheet'
import type { iTransactionData } from '../transactions-form/transactions-form.interface'

@Component({
	selector: 'tr[app-transactions-row]',
	imports: [
		LucideAngularModule,
		ZardButtonComponent,
		ZardPopoverComponent,
		ZardPopoverDirective,
		ZardDividerComponent,
		ZardBadgeComponent,
		LowerCasePipe,
	],
	templateUrl: './transactions-row.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsRow {
	private readonly transactionsService = inject(TransactionsService)
	private readonly sheetService = inject(ZardSheetService)
	private readonly dialogService = inject(ZardDialogService)

	readonly transaction = input.required<Transaction>()

	readonly EllipsisIcon = EllipsisIcon
	readonly SquarePenIcon = SquarePenIcon
	readonly Trash2Icon = Trash2Icon
	readonly FilesIcon = FilesIcon

	readonly statusIcon = computed(() => {
		return this.transaction().isPaid
			? { icon: CircleCheckIcon, class: 'text-income-foreground' }
			: { icon: CircleXIcon, class: 'text-goal-foreground' }
	})

	readonly formattedAmount = computed(() => {
		const { amount, type } = this.transaction()

		const currency = 'EUR'
		const formatted = new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(amount)

		return type === 'INCOME' ? `+${formatted}` : `-${formatted}`
	})

	readonly amountClass = computed(() =>
		this.transaction().type === 'INCOME' ? 'text-primary' : 'text-destructive',
	)

	readonly formattedDate = computed(() =>
		new Date(this.transaction().date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		}),
	)

	async updateTransaction() {
		const { TransactionsForm } = await import(
			'../transactions-form/transactions-form'
		)

		this.sheetService.create({
			zTitle: 'Edit Transaction',
			zContent: TransactionsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Save Changes',
			zOnOk: (instance: InstanceType<typeof TransactionsForm>) => {
				instance.submit()
				return false // submit() handle close
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
			zData: {
				id: this.transaction().id,
				title: this.transaction().title,
				isPaid: this.transaction().isPaid,
				type: this.transaction().type,
				date: this.transaction().date,
				categoryId: this.transaction().categoryId,
				amount: this.transaction().amount,
				bankAccountId: this.transaction().bankAccountId,
			} as iTransactionData,
		})
	}

	async duplicateTransaction() {
		const { TransactionsForm } = await import(
			'../transactions-form/transactions-form'
		)

		this.sheetService.create({
			zTitle: 'Duplicate Transaction',
			zContent: TransactionsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: false,
			zOkText: 'Create Transaction',
			zOnOk: (instance: InstanceType<typeof TransactionsForm>) => {
				instance.submit()
				return false
			},
			zCustomClasses:
				'rounded-2xl [&_[data-slot=sheet-header]]:mt-4 [&>button:first-child]:top-5',
			zData: {
				title: this.transaction().title,
				isPaid: this.transaction().isPaid,
				type: this.transaction().type,
				date: this.transaction().date,
				categoryId: this.transaction().categoryId,
				amount: this.transaction().amount,
				bankAccountId: this.transaction().bankAccountId,
			} as iTransactionData,
		})
	}

	deleteTransaction() {
		const transactionId = this.transaction().id
		if (!transactionId) return

		return this.dialogService.create({
			zTitle: `Remove ${this.transaction().title}?`,
			zDescription: 'This action cannot be undone.',
			zCancelText: 'Cancel',
			zOkText: 'Delete Goal',
			zOkDestructive: true,
			zOnOk: async () => {
				try {
					const message = await lastValueFrom(
						this.transactionsService.delete(transactionId),
					)
					toast.success(message)
					this.transactionsService.loadTransactions().subscribe()
					return true
				} catch (err: unknown) {
					const error = err as { error?: { message?: string } }
					toast.error(error.error?.message || 'Failed to delete transaction')
					return false
				}
			},
		})
	}
}
