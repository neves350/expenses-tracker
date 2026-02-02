import { Component, computed, input } from '@angular/core'
import { Card, CardColor } from '@core/api/cards.interface'
import { ZardProgressBarComponent } from '../../ui/progress-bar'

@Component({
	selector: 'app-cards-limit-progress',
	imports: [ZardProgressBarComponent],
	templateUrl: './cards-limit-progress.html',
})
export class CardsLimitProgress {
	readonly card = input.required<Card>()

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

	readonly textColorClass = computed(() => {
		return this.colorClasses[this.card().color]
	})
}
