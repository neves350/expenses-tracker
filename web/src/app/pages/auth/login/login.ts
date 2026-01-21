import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@core/services/auth/auth-service'
import {
	LockKeyholeIcon,
	LucideAngularModule,
	MailIcon,
	WalletMinimalIcon,
} from 'lucide-angular'
import { NgxSonnerToaster, toast } from 'ngx-sonner'

@Component({
	selector: 'app-login',
	imports: [LucideAngularModule, ReactiveFormsModule, NgxSonnerToaster],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly MailIcon = MailIcon
	readonly LockKeyholeIcon = LockKeyholeIcon
	readonly toast = toast

	fb = inject(FormBuilder)
	http = inject(HttpClient)
	router = inject(Router)
	authService = inject(AuthService)

	form = this.fb.nonNullable.group({
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.minLength(6), Validators.required]],
	})

	onSubmit() {
		const credentials = this.form.getRawValue()

		this.authService.login(credentials).subscribe({
			next: (_res) => {
				this.router.navigateByUrl('/') // rediract to dashboard
			},
			error: (_error) => {
				toast.error('Credentials invalids, please try again later.')
			},
		})
	}
}
