import type { Routes } from '@angular/router'
import { authGuard } from '@core/guards/auth.guard'

export const routes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login').then((m) => m.Login),
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./pages/register/register').then((m) => m.Register),
	},
	{
		path: '',
		canActivate: [authGuard],
		children: [],
	},
	{
		path: '**',
		redirectTo: '',
	},
]
