import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '@core/services/auth/auth-service'
import { catchError, switchMap, throwError } from 'rxjs'

let isRefreshing = false

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService)
	const _router = inject(Router)

	// credentials to send cookies
	const clonedRequest = req.clone({
		withCredentials: true,
	})

	return next(clonedRequest).pipe(
		catchError((error: HttpErrorResponse) => {
			// 401 error & isn't login/refresh endpoint
			if (
				error.status === 401 &&
				!req.url.includes('/sessions/password') &&
				!req.url.includes('/refresh') &&
				!isRefreshing
			) {
				isRefreshing = true

				// try to do refresh
				return authService.refresh().pipe(
					switchMap(() => {
						isRefreshing = false
						// retry original request
						return next(clonedRequest)
					}),
					catchError((refreshError) => {
						isRefreshing = false
						// if refresh failed do logout
						authService.logout()
						return throwError(() => refreshError)
					}),
				)
			}

			// doesn't try again if are login/refresh error
			if (
				error.status === 401 &&
				(req.url.includes('/refresh') || req.url.includes('/sessions/password'))
			) {
				authService.logout()
			}

			return throwError(() => error)
		}),
	)
}
