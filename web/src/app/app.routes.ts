import type { Routes } from '@angular/router'
import { authGuard } from '@core/guards/auth.guard'
import { guestGuard } from '@core/guards/guest.guard'
import { Layout } from './shared/components/layout/layout'

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () => import('./pages/login/login').then((m) => m.Login),
	},
	{
		path: 'register',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./pages/register/register').then((m) => m.Register),
	},
	{
		path: 'password/recover',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./pages/password/recover/recover').then((m) => m.Recover),
	},
	{
		path: 'password/reset',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./pages/password/reset/reset').then((m) => m.Reset),
	},
	{
		path: '',
		component: Layout,
		canActivate: [authGuard],
		children: [
			{
				path: 'dashboard',
				loadComponent: () =>
					import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
			},
			{
				path: 'cards',
				loadComponent: () => import('./pages/cards/cards').then((m) => m.Cards),
			},
			{
				path: 'profile',
				loadComponent: () =>
					import('./pages/user-profile/user-profile').then(
						(m) => m.UserProfile,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'dashboard',
	},
]
