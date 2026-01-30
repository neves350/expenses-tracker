import { ZardCardComponent } from '@/shared/components/ui/card'
import { Component, input } from '@angular/core'
import {
	ArrowDownIcon,
	ArrowUpIcon,
	HandCoinsIcon,
	LucideAngularModule,
} from 'lucide-angular'


@Component({
	selector: 'app-balance-card',
	imports: [ZardCardComponent, LucideAngularModule],
	templateUrl: './balance-card.html',
})
export class BalanceCard {
	readonly balance = input<number>(0)
	readonly percentageChange = input<number>(0)

	readonly HandCoinsIcon = HandCoinsIcon
	readonly ArrowUpIcon = ArrowUpIcon
	readonly ArrowDownIcon = ArrowDownIcon

	get isPositiveChange(): boolean {
		return this.percentageChange() >= 0
	}

	get formattedBalance(): string {
		return this.balance().toLocaleString('pt-PT', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}) + '€'
	}

	get formattedPercentage(): string {
		return Math.abs(this.percentageChange()).toFixed(1) + '%'
	}
}
