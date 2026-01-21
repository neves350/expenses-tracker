import type { Routes } from '@angular/router'
import { Login } from './pages/auth/login/login'

export const routes: Routes = [
	{
		path: 'login',
		component: Login,
	},
]
