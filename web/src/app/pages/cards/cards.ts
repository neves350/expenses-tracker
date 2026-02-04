import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { CardsService } from '@core/services/cards.service'
import { LucideAngularModule, PlusIcon, WalletCardsIcon } from 'lucide-angular'
import { CardsForm } from '@/shared/components/cards/cards-form/cards-form'
import { CardsList } from '@/shared/components/cards/cards-list/cards-list'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardCardComponent } from '@/shared/components/ui/card'
import { ZardSheetService } from '@/shared/components/ui/sheet'

@Component({
	selector: 'app-cards',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ZardButtonComponent,
		CardsList,
	],
	templateUrl: './cards.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards implements OnInit {
	readonly WalletCardsIcon = WalletCardsIcon
	readonly PlusIcon = PlusIcon

	private readonly sheetService = inject(ZardSheetService)
	private readonly cardsService = inject(CardsService)
	private readonly bankAccountsService = inject(BankAccountsService)

	// Expose service signals to template
	readonly cards = this.cardsService.cards
	readonly loading = this.cardsService.loading
	readonly hasCards = this.cardsService.hasCards

	ngOnInit(): void {
		this.cardsService.loadCards().subscribe()
		// Pre-load bank accounts for the form
		this.bankAccountsService.loadBankAccounts().subscribe()
	}

	openSheet() {
		this.sheetService.create({
			zTitle: 'New Card',
			zContent: CardsForm,
			zSide: 'right',
			zWidth: '500px',
			zHideFooter: true,
		})
	}
}
