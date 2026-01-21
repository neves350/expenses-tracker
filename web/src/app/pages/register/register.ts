import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@core/services/auth/auth-service'
import {
	EyeIcon,
	EyeOffIcon,
	LockKeyholeIcon,
	LucideAngularModule,
	MailIcon,
	WalletMinimalIcon,
} from 'lucide-angular'
import { NgxSonnerToaster, toast } from 'ngx-sonner'

@Component({
	selector: 'app-register',
	imports: [LucideAngularModule, ReactiveFormsModule, NgxSonnerToaster],
	templateUrl: './register.html',
	styleUrl: './register.css',
})
export class Register {
	readonly WalletMinimalIcon = WalletMinimalIcon
	readonly MailIcon = MailIcon
	readonly LockKeyholeIcon = LockKeyholeIcon
	readonly EyeOffIcon = EyeOffIcon
	readonly EyeIcon = EyeIcon

	readonly toast = toast

	fb = inject(FormBuilder)
	http = inject(HttpClient)
	router = inject(Router)
	authService = inject(AuthService)

	form = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.minLength(6), Validators.required]],
	})

	showPassword = false

	togglePassword() {
		this.showPassword = !this.showPassword
	}

	onSubmit() {
		const credentials = this.form.getRawValue()

		this.authService.register(credentials).subscribe({
			next: (_res) => {
				this.router.navigateByUrl('/') // rediract to dashboard
			},
			error: (_error) => {
				toast.error('Registration failed, please try again later.')
			},
		})
	}
}
