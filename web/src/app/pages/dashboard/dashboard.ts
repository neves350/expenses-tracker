import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DashboardCard } from '@/shared/components/dashboard/dashboard-card/dashboard-card'
import { DashboardCards } from '@/shared/components/dashboard/dashboard-cards/dashboard-cards'
import { DashboardChart } from '@/shared/components/dashboard/dashboard-chart/dashboard-chart'
import { DashboardTransactions } from '@/shared/components/dashboard/dashboard-transactions/dashboard-transactions'

@Component({
	selector: 'app-dashboard',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DashboardCard,
		DashboardChart,
		DashboardCards,
		DashboardTransactions,
	],
	templateUrl: './dashboard.html',
})
export class Dashboard {}
