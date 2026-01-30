import { Component } from '@angular/core'
import { BalanceCard } from './balance-card/balance-card'
import { ExpenseCard } from './expense-card/expense-card'
import { GoalCard } from './goal-card/goal-card'
import { IncomeCard } from './income-card/income-card'

@Component({
	selector: 'app-dashboard-card',
	imports: [BalanceCard, IncomeCard, ExpenseCard, GoalCard],
	templateUrl: './dashboard-card.html',
	styleUrl: './dashboard-card.css',
})
export class DashboardCard {
	// Sample data - replace with actual data from API/Service
	readonly balanceData = {
		balance: 100,
		percentageChange: 10.9,
	}

	readonly incomeData = {
		income: 100,
		percentageChange: 5.2,
	}

	readonly expenseData = {
		expense: 100,
		percentageChange: 1.2,
	}

	readonly goalData = {
		name: 'iPhone 17 Pro',
		currentAmount: 800,
		targetAmount: 1200,
	}
}
