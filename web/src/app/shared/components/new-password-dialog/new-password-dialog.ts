import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { EyeIcon, EyeOffIcon, LucideAngularModule } from 'lucide-angular'
import { ZardInputDirective } from '../ui/input'

// Password pattern: min 6 chars, uppercase, lowercase, number, and symbol
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/

@Component({
	selector: 'app-new-password-dialog',
	imports: [ReactiveFormsModule, ZardInputDirective, LucideAngularModule],
	templateUrl: './new-password-dialog.html',
	styleUrl: './new-password-dialog.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPasswordDialog {
	private readonly fb = inject(FormBuilder)

	readonly EyeIcon = EyeIcon
	readonly EyeOffIcon = EyeOffIcon

	form = this.fb.nonNullable.group({
		currentPassword: ['', [Validators.required]],
		newPassword: [
			'',
			[Validators.required, Validators.pattern(PASSWORD_PATTERN)],
		],
		confirmPassword: ['', [Validators.required]],
	})

	showPassword = signal(false)

	togglePassword() {
		this.showPassword.update((v) => !v)
	}

	passwordsMatch(): boolean {
		const { newPassword, confirmPassword } = this.form.controls
		return newPassword.value === confirmPassword.value
	}

	isFormValid(): boolean {
		return this.form.valid && this.passwordsMatch()
	}
}
