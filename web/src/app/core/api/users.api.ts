import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import type {
	ChangePasswordRequest,
	UpdateUserRequest,
	User,
	UserActionResponse,
} from './users.interface'

@Injectable({
	providedIn: 'root',
})
export class UsersApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/users`

	/**
	 * GET USER BY ID
	 */
	findById(userId: string): Observable<User> {
		return this.http.get<User>(`${this.baseUrl}/${userId}`, {
			withCredentials: true,
		})
	}

	/**
	 * UPDATE USER
	 */
	update(userId: string, data: UpdateUserRequest): Observable<User> {
		return this.http.patch<User>(`${this.baseUrl}/${userId}`, data, {
			withCredentials: true,
		})
	}

	/**
	 * CHANGE PASSWORD
	 */
	changePassword(
		userId: string,
		data: ChangePasswordRequest,
	): Observable<UserActionResponse> {
		return this.http.patch<UserActionResponse>(
			`${this.baseUrl}/${userId}/password`,
			data,
			{ withCredentials: true },
		)
	}

	/**
	 * DELETE USER
	 */
	delete(userId: string): Observable<UserActionResponse> {
		return this.http.delete<UserActionResponse>(`${this.baseUrl}/${userId}`, {
			withCredentials: true,
		})
	}
}
