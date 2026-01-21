import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthApi } from '@core/api/auth/auth-api'

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
	authApi = inject(AuthApi)

	form = this.fb.nonNullable.group({
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.minLength(6), Validators.required]],
	})

	onSubmit() {
		const credentials = this.form.getRawValue()

		this.authApi.login(credentials).subscribe({
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
