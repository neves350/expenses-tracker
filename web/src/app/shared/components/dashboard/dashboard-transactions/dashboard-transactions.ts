import { DatePipe, DecimalPipe } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	type OnInit,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { TransfersService } from '@core/services/transfers.service'
import {
	ArrowRightLeftIcon,
	ChevronRightIcon,
	LucideAngularModule,
	ScanBarcodeIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from 'lucide-angular'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'
import { ZardDividerComponent } from '../../ui/divider'

@Component({
	selector: 'app-dashboard-transactions',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ZardButtonComponent,
		RouterLink,
		ZardDividerComponent,
		DatePipe,
		DecimalPipe,
	],
	templateUrl: './dashboard-transactions.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTransactions implements OnInit {
	readonly ScanBarcodeIcon = ScanBarcodeIcon
	readonly TrendingUpIcon = TrendingUpIcon
	readonly TrendingDownIcon = TrendingDownIcon
	readonly ChevronRightIcon = ChevronRightIcon
	readonly ArrowRightLeftIcon = ArrowRightLeftIcon

	private readonly transfersService = inject(TransfersService)

	readonly hasTransfers = this.transfersService.hasTransfers
	readonly loading = this.transfersService.loading

	readonly recentTransfers = computed(() =>
		this.transfersService
			.transfers()
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 3),
	)

	formatAmount(amount: number, currency = 'EUR'): string {
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(Number(amount))
	}

	ngOnInit(): void {
		this.transfersService.loadTransfers().subscribe()
	}
}
