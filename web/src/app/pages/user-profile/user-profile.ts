import { DatePipe } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core'
import { AuthService } from '@core/services/auth/auth.service'
import { UsersService } from '@core/services/users.service'
import {
	CalendarIcon,
	LucideAngularModule,
	TagIcon,
	TargetIcon,
	WalletIcon,
} from 'lucide-angular'
import { toast } from 'ngx-sonner'
import { NewPasswordDialog } from '@/shared/components/new-password-dialog/new-password-dialog'
import { ZardAvatarComponent } from '@/shared/components/ui/avatar'
import { ZardBadgeComponent } from '@/shared/components/ui/badge'
import { ZardButtonComponent } from '@/shared/components/ui/button'
import { ZardDialogService } from '@/shared/components/ui/dialog'
import { ZardDividerComponent } from '@/shared/components/ui/divider'

interface StatBadge {
	label: string
	value: number
	icon: object
}

@Component({
	selector: 'app-user-profile',
	imports: [
		ZardDividerComponent,
		ZardAvatarComponent,
		LucideAngularModule,
		DatePipe,
		ZardBadgeComponent,
		ZardButtonComponent,
	],
	templateUrl: './user-profile.html',
	styleUrl: './user-profile.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
	private readonly authService = inject(AuthService)
	private readonly usersService = inject(UsersService)
	private readonly dialogService = inject(ZardDialogService)

	readonly user = this.authService.currentUser
	readonly WalletIcon = WalletIcon
	readonly TagIcon = TagIcon
	readonly TargetIcon = TargetIcon
	readonly CalendarIcon = CalendarIcon

	readonly initials = computed(() => {
		const name = this.user()?.name
		if (!name) return ''
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
	})

	// TODO: Replace with real API data
	readonly stats: StatBadge[] = [
		{ label: 'Wallets', value: 3, icon: WalletIcon },
		{ label: 'Categories', value: 12, icon: TagIcon },
		{ label: 'Goals', value: 2, icon: TargetIcon },
	]

	openDialog() {
		const dialogRef = this.dialogService.create({
			zTitle: 'Change Password',
			zDescription: 'Verify your current password and enter a new one.',
			zContent: NewPasswordDialog,
			zCustomClasses: 'dialog-center-layout',
			zOkText: 'Update',
			zOnOk: (instance) => {
				if (!instance.isFormValid()) {
					instance.form.markAllAsTouched()
					return false
				}

				const userId = this.user()?.id
				if (!userId) {
					toast.error('User not found')
					return false
				}

				const { currentPassword, newPassword, confirmPassword } =
					instance.form.value

				this.usersService
					.changePassword(userId, {
						currentPassword: currentPassword ?? '',
						newPassword: newPassword ?? '',
						confirmPassword: confirmPassword ?? '',
					})
					.subscribe({
						next: (message) => {
							toast.success(message)
							dialogRef.close()
						},
						error: (err) => {
							toast.error(err.error?.message || 'Failed to change password')
						},
					})

				return false
			},
			zWidth: '425px',
		})
	}
}
