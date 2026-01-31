import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core'
import {
	type Card,
	CardColor,
	CardType,
	CurrencyType,
} from '@core/api/cards.interface'
import {
	BanknoteIcon,
	CreditCardIcon,
	LucideAngularModule,
	SmartphoneIcon,
	TrendingUpIcon,
	WalletIcon,
} from 'lucide-angular'
import { ZardCardComponent } from '@/shared/components/ui/card'

@Component({
	selector: 'app-cards-preview',
	imports: [ZardCardComponent, LucideAngularModule],
	templateUrl: './cards-preview.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPreview {
	readonly card = input.required<Partial<Card>>()

	protected readonly BanknoteIcon = BanknoteIcon
	protected readonly WalletIcon = WalletIcon
	protected readonly CreditCardIcon = CreditCardIcon
	protected readonly SmartphoneIcon = SmartphoneIcon
	protected readonly TrendingUpIcon = TrendingUpIcon

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

	private readonly typeLabels: Record<CardType, string> = {
		[CardType.CASH]: 'Cash',
		[CardType.BANK_ACCOUNT]: 'Bank Account',
		[CardType.CREDIT_CARD]: 'Credit Card',
		[CardType.DIGITAL_WALLET]: 'Digital Wallet',
		[CardType.INVESTMENT]: 'Investment',
	}

	readonly bgColorClass = computed(() => {
		const color = this.card().color || CardColor.GRAY
		return this.colorClasses[color]
	})

	readonly cardIcon = computed(() => {
		const type = this.card().type || CardType.CASH
		const iconMap: Record<CardType, typeof BanknoteIcon> = {
			[CardType.CASH]: this.BanknoteIcon,
			[CardType.BANK_ACCOUNT]: this.WalletIcon,
			[CardType.CREDIT_CARD]: this.CreditCardIcon,
			[CardType.DIGITAL_WALLET]: this.SmartphoneIcon,
			[CardType.INVESTMENT]: this.TrendingUpIcon,
		}
		return iconMap[type]
	})

	readonly typeLabel = computed(() => {
		const type = this.card().type || CardType.CASH
		return this.typeLabels[type]
	})

	readonly formattedBalance = computed(() => {
		const balance = this.card().balance || 0
		const currency = this.card().currency || CurrencyType.EUR
		const formatted = Number(balance).toLocaleString('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		return currency === CurrencyType.EUR ? `${formatted}€` : `$${formatted}`
	})

	readonly cardName = computed(() => this.card().name || 'Card Name')
	readonly lastFour = computed(() => this.card().lastFour)
	readonly currency = computed(() => this.card().currency || CurrencyType.EUR)
}
