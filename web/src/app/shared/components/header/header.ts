import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import { LucideAngularModule, SlashIcon } from 'lucide-angular'
import { filter, map } from 'rxjs'
import { BreadcrumbService } from '@/shared/services/breadcrumb.service'
import { Theme } from '../theme/theme'
import {
	ZardBreadcrumbComponent,
	ZardBreadcrumbItemComponent,
} from '../ui/breadcrumb'

interface BreadcrumbItem {
	label: string
	url?: string
}

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
	'/dashboard': [{ label: 'Main Menu' }, { label: 'Dashboard' }],
	'/transactions': [{ label: 'Finances' }, { label: 'Transactions' }],
	'/cards': [{ label: 'Finances' }, { label: 'Cards' }],
	'/accounts': [{ label: 'Finances' }, { label: 'Accounts' }],
	'/account-details': [{ label: 'Finances' }, { label: 'Accounts' }],
	'/categories': [{ label: 'Finances' }, { label: 'Categories' }],
	'/goals': [{ label: 'Analytics' }, { label: 'Goals' }],
	'/goal-details': [{ label: 'Analytics' }, { label: 'Goals' }],
	'/statistics': [{ label: 'Analytics' }, { label: 'Statistics' }],
	'/profile': [{ label: 'Others' }, { label: 'Profile' }],
	'/settings': [{ label: 'Others' }, { label: 'Settings' }],
}

@Component({
	selector: 'app-header',
	imports: [
		Theme,
		ZardBreadcrumbComponent,
		ZardBreadcrumbItemComponent,
		LucideAngularModule,
	],
	templateUrl: './header.html',
	host: {
		class: 'flex-1',
	},
})
export class Header {
	private readonly router = inject(Router)
	private readonly breadcrumbsService = inject(BreadcrumbService)

	readonly SlashIcon = SlashIcon

	private readonly currentUrl = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => event.urlAfterRedirects),
		),
		{ initialValue: this.router.url },
	)

	readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
		const url = this.currentUrl()
		const label = this.breadcrumbsService.label()

		// to match dynamic routes by prefix
		const baseUrl = `/${url.split('/')[1]}`
		const base = BREADCRUMB_MAP[baseUrl] ??
			BREADCRUMB_MAP[url] ?? [{ label: 'Dashboard' }]

		if (label) return [...base, { label }]

		return base
	})
}
