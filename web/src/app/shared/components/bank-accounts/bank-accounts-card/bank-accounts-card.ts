import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core'
import { BankAccount, BankType } from '@core/api/bank-accounts.interface'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { CardsService } from '@core/services/cards.service'
import {
	CoinsIcon,
	CreditCardIcon,
	EllipsisVerticalIcon,
	EyeIcon,
	HandCoinsIcon,
	LandmarkIcon,
	LucideAngularModule,
	SquarePenIcon,
	Trash2Icon,
	WalletMinimalIcon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { lastValueFrom } from 'rxjs'
import { ZardBadgeComponent } from '../../ui/badge'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardDialogService } from '../../ui/dialog'
import { ZardDividerComponent } from '../../ui/divider'
import {
	ZardPopoverCloseDirective,
	ZardPopoverComponent,
	ZardPopoverDirective,
} from '../../ui/popover'
import { ZardSheetService } from '../../ui/sheet'
import type { iSheetData } from '../bank-accounts-form/bank-account-form.interface'
import { BankAccountsForm } from '../bank-accounts-form/bank-accounts-form'

@Component({
	selector: 'app-bank-accounts-card',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ZardButtonComponent,
		ZardDividerComponent,
		ZardPopoverCloseDirective,
		ZardPopoverComponent,
		ZardPopoverDirective,
		ZardBadgeComponent,
	],
	templateUrl: './bank-accounts-card.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block h-full',
	},
})
export class BankAccountsCard {
	readonly account = input.required<BankAccount>()

	private readonly dialogService = inject(ZardDialogService)
	private readonly sheetService = inject(ZardSheetService)
	private readonly bankAccountsService = inject(BankAccountsService)
	private readonly cardsService = inject(CardsService)

	readonly HandCoinsIcon = HandCoinsIcon
	readonly CreditCardIcon = CreditCardIcon
	readonly LandmarkIcon = LandmarkIcon
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly CoinsIcon = CoinsIcon
	readonly EllipsisVerticalIcon = EllipsisVerticalIcon

	readonly SquarePenIcon = SquarePenIcon
	readonly Trash2Icon = Trash2Icon
	readonly EyeIcon = EyeIcon

	private readonly typeLabels: Record<BankType, string> = {
		[BankType.WALLET]: 'Wallet',
		[BankType.CHECKING]: 'Checking',
		[BankType.SAVINGS]: 'Savings',
		[BankType.INVESTMENT]: 'Investment',
	}

	readonly bankAccountIcon = computed(() => {
		const iconMap: Record<BankType, typeof CreditCardIcon> = {
			[BankType.WALLET]: this.WalletMinimalIcon,
			[BankType.CHECKING]: this.LandmarkIcon,
			[BankType.SAVINGS]: this.HandCoinsIcon,
			[BankType.INVESTMENT]: this.CoinsIcon,
		}
		return iconMap[this.account().type]
	})

	readonly typeLabel = computed(() => {
		return this.typeLabels[this.account().type]
	})

	readonly formattedBalance = computed(() => {
		const { balance, currency } = this.account()
		if (balance === null || balance === undefined) return null
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(Number(balance))
	})

	// Track linked cards count
	private readonly linkedCardsCount = signal<number | null>(null)
	readonly canDelete = computed(() => this.linkedCardsCount() === 0)

	constructor() {
		// Load linked cards count when account changes
		effect(() => {
			const bankAccountId = this.account().id
			if (bankAccountId) {
				this.cardsService
					.countByBankAccount(bankAccountId)
					.subscribe((count) => {
						this.linkedCardsCount.set(count)
					})
			}
		})
	}

	updateCard() {
		this.sheetService.create({
			zTitle: 'Edit Bank Account',
			zContent: BankAccountsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: true,
			zData: {
				id: this.account().id,
				name: this.account().name,
				type: this.account().type,
				balance: this.account().balance,
				currency: this.account().currency,
			} as iSheetData,
		})
	}

	deleteCard() {
		const bankAccountId = this.account().id
		if (!bankAccountId) return

		return this.dialogService.create({
			zTitle: `Remove ${this.account().name}?`,
			zDescription: 'This action cannot be undone.',
			zCancelText: 'Cancel',
			zOkText: 'Delete Bank Account',
			zOkDestructive: true,
			zOnOk: async () => {
				try {
					const message = await lastValueFrom(
						this.bankAccountsService.delete(bankAccountId),
					)
					toast.success(message)
					this.bankAccountsService.loadBankAccounts().subscribe()
					return true
				} catch (err: unknown) {
					const error = err as { error?: { message?: string } }
					toast.error(error.error?.message || 'Failed to delete bank account')
					return false
				}
			},
		})
	}
}
