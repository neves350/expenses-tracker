import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
} from '@angular/core'
import {
	Card,
	CardColor,
	CardType,
	CurrencyType,
} from '@core/api/cards.interface'
import { CardsService } from '@core/services/cards.service'
import {
	ArrowRightIcon,
	BanknoteIcon,
	CreditCardIcon,
	LucideAngularModule,
	SmartphoneIcon,
	SquarePenIcon,
	Trash2Icon,
	TrendingUpIcon,
	WalletIcon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { lastValueFrom } from 'rxjs'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardDialogService } from '../../ui/dialog'

@Component({
	selector: 'app-cards-card',
	imports: [ZardCardComponent, LucideAngularModule, ZardButtonComponent],
	templateUrl: './cards-card.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsCard {
	readonly card = input.required<Card>()

	private readonly dialogService = inject(ZardDialogService)
	private readonly cardsService = inject(CardsService)

	readonly BanknoteIcon = BanknoteIcon
	readonly WalletIcon = WalletIcon
	readonly CreditCardIcon = CreditCardIcon
	readonly SmartphoneIcon = SmartphoneIcon
	readonly TrendingUpIcon = TrendingUpIcon
	readonly SquarePenIcon = SquarePenIcon
	readonly Trash2Icon = Trash2Icon
	readonly ArrowRightIcon = ArrowRightIcon

	private readonly colorClasses: Record<CardColor, string> = {
		[CardColor.GRAY]: 'bg-zinc-700',
		[CardColor.PURPLE]: 'bg-violet-700',
		[CardColor.BLUE]: 'bg-sky-500',
		[CardColor.GREEN]: 'bg-emerald-700',
		[CardColor.YELLOW]: 'bg-yellow-400',
		[CardColor.ORANGE]: 'bg-amber-500',
		[CardColor.RED]: 'bg-red-500',
		[CardColor.PINK]: 'bg-fuchsia-300',
	}

	private readonly textColorClasses: Record<CardColor, string> = {
		[CardColor.GRAY]: 'text-zinc-700',
		[CardColor.PURPLE]: 'text-violet-700',
		[CardColor.BLUE]: 'text-sky-500',
		[CardColor.GREEN]: 'text-emerald-700',
		[CardColor.YELLOW]: 'text-yellow-400',
		[CardColor.ORANGE]: 'text-amber-500',
		[CardColor.RED]: 'text-red-500',
		[CardColor.PINK]: 'text-fuchsia-300',
	}

	private readonly typeLabels: Record<CardType, string> = {
		[CardType.CASH]: 'Cash',
		[CardType.BANK_ACCOUNT]: 'Bank Account',
		[CardType.CREDIT_CARD]: 'Credit Card',
		[CardType.DIGITAL_WALLET]: 'Digital Wallet',
		[CardType.INVESTMENT]: 'Investment',
	}

	readonly bgColorClass = computed(() => {
		return this.colorClasses[this.card().color]
	})

	readonly textColorClass = computed(() => {
		return this.textColorClasses[this.card().color]
	})

	readonly cardIcon = computed(() => {
		const iconMap: Record<CardType, typeof BanknoteIcon> = {
			[CardType.CASH]: this.BanknoteIcon,
			[CardType.BANK_ACCOUNT]: this.WalletIcon,
			[CardType.CREDIT_CARD]: this.CreditCardIcon,
			[CardType.DIGITAL_WALLET]: this.SmartphoneIcon,
			[CardType.INVESTMENT]: this.TrendingUpIcon,
		}
		return iconMap[this.card().type]
	})

	readonly typeLabel = computed(() => {
		return this.typeLabels[this.card().type]
	})

	readonly formattedBalance = computed(() => {
		const balance = this.card().balance
		const currency = this.card().currency
		const formatted = Number(balance).toLocaleString('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		return currency === CurrencyType.EUR ? `${formatted}€` : `$${formatted}`
	})

	deleteWallet() {
		return this.dialogService.create({
			zTitle: `Remove ${this.card().name}?`,
			zDescription: 'This action cannot be undone.',
			zCancelText: 'Cancel',
			zOkText: 'Delete Card',
			zOkDestructive: true,
			zOnOk: async () => {
				const walletId = this.card().id
				if (!walletId) return false

				try {
					const message = await lastValueFrom(
						this.cardsService.delete(walletId),
					)
					toast.success(message)
					this.cardsService.loadCards().subscribe() // Needs the subscribe because returns an observable on service
					return true
				} catch (err: any) {
					toast.error(err.error?.message || 'Failed to delete card')
					return false
				}
			},
		})
	}
}
