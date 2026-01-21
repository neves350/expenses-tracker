import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import type { AuthResponse } from './types/auth-response.type'
import type { LoginRequest } from './types/login-request.type'
import type { RegisterRequest } from './types/register-request.type'
import type { User } from './types/user.type'

@Injectable({
	providedIn: 'root',
})
export class AuthApi {
	http = inject(HttpClient)
	baseUrl = `${environment.apiUrl}`

	/**
	 * LOGIN
	 */
	login(credentials: LoginRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(
			`${this.baseUrl}/sessions/password`,
			credentials,
			{ withCredentials: true }, // enables cookies
		)
	}

	/**
	 * REGISTER
	 */
	register(data: RegisterRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/users`, data, {
			withCredentials: true,
		})
	}

	/**
	 * REFRESH TOKEN
	 */
	refresh(): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(
			`${this.baseUrl}/refresh`,
			{},
			{ withCredentials: true }, // send refreshToken to cookies
		)
	}

	/**
	 * GET CURRENT USER
	 */
	getProfile(): Observable<User> {
		return this.http.get<User>(
			`${this.baseUrl}/profile`,
			{ withCredentials: true }, // send accessToken to cookies
		)
	}

	/**
	 * LOGOUT
	 */
	logout(): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(
			`${this.baseUrl}/logout`,
			{},
			{ withCredentials: true },
		)
	}
}
