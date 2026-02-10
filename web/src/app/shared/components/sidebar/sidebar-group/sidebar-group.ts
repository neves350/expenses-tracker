import { Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import {
	ArrowRightLeftIcon,
	ChartAreaIcon,
	GoalIcon,
	LandmarkIcon,
	LayoutDashboardIcon,
	LucideAngularModule,
	type LucideIconData,
	SettingsIcon,
	TagsIcon,
	WalletCardsIcon,
} from 'lucide-angular'
import { ZardDividerComponent } from '../../ui/divider'
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
		ZardDividerComponent,
	],
	templateUrl: './sidebar-group.html',
})
export class SidebarGroup {
	private readonly sidebarService = inject(HlmSidebarService)

	readonly isCollapsed = computed(
		() => this.sidebarService.state() === 'collapsed',
	)

	readonly isCollapsedClass = computed(() =>
		this.isCollapsed()
			? 'text-sidebar-accent bg-sidebar-group font-semibold border-0 rounded-md'
			: 'text-sidebar-accent bg-sidebar-group font-semibold border-l-3 border-sidebar-accent pl-4',
	)

	readonly mainItem: MenuItem[] = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboardIcon,
		},
	]

	readonly financeItem: MenuItem[] = [
		{
			title: 'Transactions',
			url: '/transactions',
			icon: ArrowRightLeftIcon,
		},
		{
			title: 'Cards',
			url: '/wallets',
			icon: WalletCardsIcon,
		},
		{
			title: 'Accounts',
			url: '/bank-accounts',
			icon: LandmarkIcon,
		},
		{
			title: 'Categories',
			url: '/categories',
			icon: TagsIcon,
		},
	]

	readonly analyticsItem: MenuItem[] = [
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

	readonly othersItem: MenuItem[] = [
		{
			title: 'Settings',
			url: '/settings',
			icon: SettingsIcon,
		},
	]
}
