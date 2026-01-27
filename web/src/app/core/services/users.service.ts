import { Injectable, inject } from '@angular/core'
import { UsersApi } from '@core/api/users.api'
import type {
	ChangePasswordRequest,
	UpdateUserRequest,
	User,
} from '@core/api/users.interface'
import { map, Observable } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private readonly usersApi = inject(UsersApi)

	findById(userId: string): Observable<User> {
		return this.usersApi.findById(userId)
	}

	update(userId: string, data: UpdateUserRequest): Observable<User> {
		return this.usersApi.update(userId, data)
	}

	changePassword(
		userId: string,
		data: ChangePasswordRequest,
	): Observable<string> {
		return this.usersApi
			.changePassword(userId, data)
			.pipe(map((response) => response.message))
	}

	delete(userId: string): Observable<string> {
		return this.usersApi
			.delete(userId)
			.pipe(map((response) => response.message))
	}
}
