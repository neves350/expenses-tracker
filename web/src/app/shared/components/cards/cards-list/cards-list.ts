import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { Card } from '@core/api/cards.interface'
import { CardsCard } from '../cards-card/cards-card'

@Component({
	selector: 'app-cards-list',
	imports: [CardsCard],
	templateUrl: './cards-list.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsList {
	readonly cards = input.required<Card[]>()
}
