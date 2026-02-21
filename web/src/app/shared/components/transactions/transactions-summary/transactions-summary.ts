import { DecimalPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TransactionsService } from '@core/services/transactions.service'
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CoinsIcon,
	LucideAngularModule,
} from 'lucide-angular'
import { ZardCardComponent } from '../../ui/card'

@Component({
	selector: 'app-transactions-summary',
	imports: [ZardCardComponent, LucideAngularModule, DecimalPipe],
	templateUrl: './transactions-summary.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsSummary {
	private readonly transactionsService = inject(TransactionsService)

	readonly monthSummary = this.transactionsService.monthSummary

	readonly ArrowUpIcon = ArrowUpIcon
	readonly ArrowDownIcon = ArrowDownIcon
	readonly CoinsIcon = CoinsIcon
}
