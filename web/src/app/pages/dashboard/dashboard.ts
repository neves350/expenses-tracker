import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DashboardCard } from '@/shared/components/dashboard/dashboard-card/dashboard-card'
import { DashboardChart } from '@/shared/components/dashboard/dashboard-chart/dashboard-chart'
import { DashboardTransactions } from '@/shared/components/dashboard/dashboard-transactions/dashboard-transactions'
import { DashboardWallets } from '@/shared/components/dashboard/dashboard-wallets/dashboard-wallets'

@Component({
	selector: 'app-dashboard',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DashboardCard,
		DashboardChart,
		DashboardWallets,
		DashboardTransactions,
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class Dashboard {}
