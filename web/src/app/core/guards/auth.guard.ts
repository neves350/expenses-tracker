import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth-service'

export const authGuard: CanActivateFn = (_route, state) => {
	const authService = inject(AuthService)
	const router = inject(Router)

	if (authService.isAuthenticated()) {
		return true
	}

	// redirect to login saving the original url
	router.navigate(['/login'], {
		queryParams: { returnUrl: state.url },
	})
	return false
}
