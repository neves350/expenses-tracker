import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
	ChevronRightIcon,
	LucideAngularModule,
	WalletMinimalIcon,
} from 'lucide-angular'
import { ZardButtonComponent } from '../../ui/button'
import { ZardCardComponent } from '../../ui/card'

@Component({
	selector: 'app-dashboard-wallets',
	imports: [
		ZardCardComponent,
		LucideAngularModule,
		ZardButtonComponent,
		RouterLink,
	],
	templateUrl: './dashboard-wallets.html',
	styleUrl: './dashboard-wallets.css',
})
export class DashboardWallets {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly ChevronRightIcon = ChevronRightIcon
}
