import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth/auth.service'
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		LucideAngularModule,
		ReactiveFormsModule,
		NgxSonnerToaster,
		RouterLink,
	],
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

	private readonly fb = inject(FormBuilder)
	private readonly router = inject(Router)
	private readonly authService = inject(AuthService)

	form = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.minLength(6), Validators.required]],
	})

	showPassword = signal(false)

	togglePassword() {
		this.showPassword.update((v) => !v)
	}

	onSubmit() {
		const credentials = this.form.getRawValue()

		this.authService.register(credentials).subscribe({
			next: () => {
				this.router.navigateByUrl('/dashboard')
			},
			error: () => {
				toast.error('Registration failed, please try again later.')
			},
		})
	}
}
