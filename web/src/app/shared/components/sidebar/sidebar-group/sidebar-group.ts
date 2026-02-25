import { Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import {
	ArrowRightLeftIcon,
	ChartNoAxesColumnIncreasingIcon,
	GoalIcon,
	LandmarkIcon,
	LayoutDashboardIcon,
	LucideAngularModule,
	type LucideIconData,
	RepeatIcon,
	SettingsIcon,
	TagIcon,
	WalletIcon,
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

	readonly activeExpandedClass =
		'text-sidebar-accent bg-sidebar-group font-semibold border-l-3 border-sidebar-accent pl-4'

	readonly activeCollapsedClass =
		'text-sidebar-accent bg-sidebar-group font-semibold border-0 rounded-md'

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
			title: 'Recurrings',
			url: '/recurrings',
			icon: RepeatIcon,
		},
		{
			title: 'Cards',
			url: '/cards',
			icon: WalletIcon,
		},
		{
			title: 'Accounts',
			url: '/accounts',
			icon: LandmarkIcon,
		},
		{
			title: 'Categories',
			url: '/categories',
			icon: TagIcon,
		},
	]

	readonly analyticsItem: MenuItem[] = [
		{
			title: 'Statistics',
			url: '/statistics',
			icon: ChartNoAxesColumnIncreasingIcon,
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
