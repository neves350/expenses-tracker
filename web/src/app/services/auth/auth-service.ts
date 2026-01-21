import { Injectable, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { AuthApi } from '@core/api/auth/auth-api'
import type { AuthResponse } from '@core/api/auth/types/auth-response.type'
import type { LoginRequest } from '@core/api/auth/types/login-request.type'
import type { RegisterRequest } from '@core/api/auth/types/register-request.type'
import type { User } from '@core/api/auth/types/user.type'
import { catchError, Observable, tap, throwError } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly authApi = inject(AuthApi)
	private readonly router = inject(Router)

	readonly currentUser = signal<User | null>(null)

	readonly isAuthenticated = signal<boolean>(false)
	readonly isLoading = signal<boolean>(false)

	/**
	 * LOGIN
	 */
	login(credentials: LoginRequest): Observable<AuthResponse> {
		this.isLoading.set(true)

		return this.authApi.login(credentials).pipe(
			tap(() => {
				this.isAuthenticated.set(true)

				// get user profile after login
				this.loadUserProfile()
			}),
			catchError((error) => {
				this.isLoading.set(false)
				return throwError(() => error)
			}),
		)
	}

	/**
	 * REGISTER
	 */
	register(data: RegisterRequest): Observable<AuthResponse> {
		this.isLoading.set(true)

		return this.authApi.register(data).pipe(
			tap(() => {
				this.isLoading.set(false)
			}),
			catchError((error) => {
				this.isLoading.set(false)
				return throwError(() => error)
			}),
		)
	}

	/**
	 * REFRESH TOKENS
	 */
	refresh(): Observable<AuthResponse> {
		return this.authApi.refresh()
	}

	/**
	 * LOAD USER PROFILE
	 */
	loadUserProfile(): void {
		this.authApi.getProfile().subscribe({
			next: (user) => {
				this.currentUser.set(user)
				this.isAuthenticated.set(true)
				this.isLoading.set(false)
			},
			error: () => {
				this.currentUser.set(null)
				this.isAuthenticated.set(false)
				this.isLoading.set(false)
			},
		})
	}

	/**
	 * LOGOUT
	 */
	logout(): void {
		this.authApi.logout().subscribe({
			next: () => {
				this.currentUser.set(null)
				this.isAuthenticated.set(false)
				this.router.navigate(['/login'])
			},
			error: () => {
				// Even if backend fails, clear local state
				this.currentUser.set(null)
				this.isAuthenticated.set(false)
				this.router.navigate(['/login'])
			},
		})
	}

	/**
	 * Check if user is authenticated on app
	 */
	checkAuth(): void {
		this.loadUserProfile()
	}
}
