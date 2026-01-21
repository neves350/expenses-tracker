import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginApi } from '@core/api/auth/login-api'

import {
	LockKeyholeIcon,
	LucideAngularModule,
	MailIcon,
	WalletMinimalIcon,
} from 'lucide-angular'

@Component({
	selector: 'app-login',
	imports: [LucideAngularModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly MailIcon = MailIcon
	readonly LockKeyholeIcon = LockKeyholeIcon

	fb = inject(FormBuilder)
	http = inject(HttpClient)
	router = inject(Router)
	loginApi = inject(LoginApi)

	form = this.fb.nonNullable.group({
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.minLength(6), Validators.required]],
	})

	onSubmit() {
		const { email, password } = this.form.getRawValue()

		this.loginApi.signIn(email, password).subscribe({
			next: (res) => {
				console.log('RESPONSE:', res)
				this.router.navigateByUrl('/')
			},
			error: (error) => {
				console.log('ERROR:', error)
			},
		})
	}
}
