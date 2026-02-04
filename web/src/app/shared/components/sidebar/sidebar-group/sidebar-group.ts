import { Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import {
	ArrowRightLeftIcon,
	ChartAreaIcon,
	CreditCardIcon,
	GoalIcon,
	LandmarkIcon,
	LayoutDashboardIcon,
	LucideAngularModule,
	type LucideIconData,
} from 'lucide-angular'
import {
	HlmSidebarImports,
	HlmSidebarService,
} from '../../ui/spartan/sidebar/src'

interface MenuItem {
	title: string
	url: string
	icon: LucideIconData
}

@Component({
	selector: 'app-sidebar-group',
	imports: [
		HlmSidebarImports,
		LucideAngularModule,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './sidebar-group.html',
	styleUrl: './sidebar-group.css',
})
export class SidebarGroup {
	private readonly sidebarService = inject(HlmSidebarService)

	readonly isCollapsed = computed(
		() => this.sidebarService.state() === 'collapsed',
	)

	readonly items: MenuItem[] = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboardIcon,
		},
		{
			title: 'Cards',
			url: '/cards',
			icon: CreditCardIcon,
		},
		{
			title: 'Accounts',
			url: '/bank-account',
			icon: LandmarkIcon,
		},
		{
			title: 'Transactions',
			url: '/transactions',
			icon: ArrowRightLeftIcon,
		},
		{
			title: 'Statistics',
			url: '/statistics',
			icon: ChartAreaIcon,
		},
		{
			title: 'Goals',
			url: '/goals',
			icon: GoalIcon,
		},
	]
}
