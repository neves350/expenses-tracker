import { DatePipe } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core'
import { AuthService } from '@core/services/auth/auth.service'
import {
	CalendarIcon,
	LucideAngularModule,
	TagIcon,
	TargetIcon,
	WalletIcon,
} from 'lucide-angular'
import { ZardAvatarComponent } from '@/shared/components/ui/avatar'
import { ZardBadgeComponent } from '@/shared/components/ui/badge'
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
	],
	templateUrl: './user-profile.html',
	styleUrl: './user-profile.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
	private readonly authService = inject(AuthService)

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
}
