import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '../../../../environments/environment'
import type { AuthResponse } from './types/auth-response.type'
import type { LoginRequest } from './types/login-request.type'

@Injectable({
	providedIn: 'root',
})
export class LoginApi {
	http = inject(HttpClient)
	baseUrl = `${environment.apiUrl}`

	login(credentials: LoginRequest) {
		return this.http.post<AuthResponse>(
			`${this.baseUrl}/sessions/password`,
			credentials,
			// { withCredentials: true },
		)
	}
}
