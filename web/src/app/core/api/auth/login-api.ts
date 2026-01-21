import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class LoginApi {
	http = inject(HttpClient)

	signIn(email: string, password: string) {
		return this.http.post<{ message: string }>(
			'http://localhost:3000/sessions/password',
			{ email, password },
		)
	}
}
