import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { type Card, CardColor } from '@core/api/cards.interface'
import { CardsService } from '@core/services/cards.service'
import {
	ChevronRightIcon,
	CreditCardIcon,
	LucideAngularModule,
	WalletMinimalIcon,
} from 'lucide-angular'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardDividerComponent } from '../../ui/divider'

@Component({
	selector: 'app-dashboard-wallets',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ZardButtonComponent,
		ZardDividerComponent,
		RouterLink,
	],
	templateUrl: './dashboard-cards.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCards implements OnInit {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly ChevronRightIcon = ChevronRightIcon
	readonly CreditCardIcon = CreditCardIcon

	private cardsService = inject(CardsService)

	readonly hasCreditCards = this.cardsService.hasCreditCards

	creditCards = computed(() =>
		this.cardsService
			.cards()
			.filter((w) => w.type === 'CREDIT_CARD')
			.sort((a, b) => {
				const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
				const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
				return dateB - dateA
			})
			.slice(0, 2),
	)

	ngOnInit(): void {
		this.cardsService.loadCards().subscribe()
	}

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

	getBgColorClass(wallet: Card): string {
		return this.colorClasses[wallet.color]
	}
}
