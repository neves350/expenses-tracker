import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth/auth.service'
import {
	ChevronsUpDownIcon,
	LogOutIcon,
	LucideAngularModule,
	UserIcon,
} from 'lucide-angular'
import { ZardAvatarComponent } from '../ui/avatar'
import { ZardDividerComponent } from '../ui/divider'
import { ZardDropdownImports } from '../ui/dropdown'

@Component({
	selector: 'app-profile-button',
	imports: [
		ZardDropdownImports,
		ZardAvatarComponent,
		ZardDividerComponent,
		LucideAngularModule,
		RouterLink,
	],
	templateUrl: './profile-button.html',
	styleUrl: './profile-button.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileButton {
	private readonly authService = inject(AuthService)

	readonly user = this.authService.currentUser

	readonly UserIcon = UserIcon
	readonly LogOutIcon = LogOutIcon
	readonly ChevronsUpDownIcon = ChevronsUpDownIcon

	readonly initials = computed(() => {
		const name = this.user()?.name
		if (!name) return ''
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
	})

	logout() {
		this.authService.logout()
	}
}
