import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth/auth.service'
import {
	CheckIcon,
	ChevronDownIcon,
	CoinsIcon,
	LogOutIcon,
	LucideAngularModule,
	UserIcon,
} from 'lucide-angular'
import { ZardAvatarComponent } from '../ui/avatar'
import { ZardDividerComponent } from '../ui/divider'
import { ZardDropdownImports } from '../ui/dropdown'

type Currency = 'USD' | 'EUR'

const CURRENCY_KEY = 'currency'

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
	readonly ChevronDownIcon = ChevronDownIcon
	readonly UserIcon = UserIcon
	readonly LogOutIcon = LogOutIcon
	readonly CoinsIcon = CoinsIcon
	readonly CheckIcon = CheckIcon

	readonly currency = signal<Currency>(this.getStoredCurrency())
	readonly currencies: Currency[] = ['USD', 'EUR']

	readonly initials = computed(() => {
		const name = this.user()?.name
		if (!name) return ''
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
	})

	setCurrency(currency: Currency) {
		this.currency.set(currency)
		localStorage.setItem(CURRENCY_KEY, currency)
	}

	logout() {
		this.authService.logout()
	}

	private getStoredCurrency(): Currency {
		const stored = localStorage.getItem(CURRENCY_KEY)
		return stored === 'EUR' ? 'EUR' : 'USD'
	}
}
