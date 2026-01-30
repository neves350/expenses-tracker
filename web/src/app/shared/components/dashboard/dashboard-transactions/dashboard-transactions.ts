import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
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
	],
	templateUrl: './dashboard-transactions.html',
	styleUrl: './dashboard-transactions.css',
})
export class DashboardTransactions {
	readonly ScanBarcodeIcon = ScanBarcodeIcon
	readonly TrendingUpIcon = TrendingUpIcon
	readonly TrendingDownIcon = TrendingDownIcon
	readonly ChevronRightIcon = ChevronRightIcon
}
