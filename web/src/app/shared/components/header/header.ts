import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import {
	ArrowRightLeftIcon,
	ChartAreaIcon,
	GoalIcon,
	LayoutDashboardIcon,
	LucideAngularModule,
	type LucideIconData,
	SettingsIcon,
	UserIcon,
	WalletCardsIcon,
} from 'lucide-angular'
import { filter, map } from 'rxjs'
import { Theme } from '../theme/theme'
import { ZardDividerComponent } from '../ui/divider'
import { HlmSidebarService } from '../ui/spartan/sidebar/src'

interface PageInfo {
	title: string
	icon: LucideIconData
}

const PAGE_MAP: Record<string, PageInfo> = {
	'/dashboard': { title: 'Dashboard', icon: LayoutDashboardIcon },
	'/wallets': { title: 'Wallets', icon: WalletCardsIcon },
	'/transactions': { title: 'Transactions', icon: ArrowRightLeftIcon },
	'/statistics': { title: 'Statistics', icon: ChartAreaIcon },
	'/goals': { title: 'Goals', icon: GoalIcon },
	'/profile': { title: 'Profile', icon: UserIcon },
	'/settings': { title: 'Settings', icon: SettingsIcon },
}

@Component({
	selector: 'app-header',
	imports: [Theme, LucideAngularModule, ZardDividerComponent],
	templateUrl: './header.html',
	styleUrl: './header.css',
	host: {
		class: 'flex-1',
	},
})
export class Header {
	private readonly router = inject(Router)
	private readonly sidebarService = inject(HlmSidebarService)

	private readonly currentUrl = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => event.urlAfterRedirects),
		),
		{ initialValue: this.router.url },
	)

	readonly pageInfo = computed<PageInfo>(() => {
		const url = this.currentUrl()
		return PAGE_MAP[url] ?? { title: 'Dashboard', icon: LayoutDashboardIcon }
	})

	readonly showPageInfo = computed(() => {
		return this.sidebarService.state() === 'collapsed' || this.sidebarService.isMobile()
	})
}
