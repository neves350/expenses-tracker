import { Component } from '@angular/core'
import { CategoryChart } from './category-chart/category-chart'
import { TransactionChart } from './transaction-chart/transaction-chart'

@Component({
	selector: 'app-dashboard-chart',
	imports: [TransactionChart, CategoryChart],
	templateUrl: './dashboard-chart.html',
})
export class DashboardChart {}
