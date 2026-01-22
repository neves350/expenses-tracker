import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthService } from '@core/services/auth/auth.service'
import { LogOutIcon, LucideAngularModule } from 'lucide-angular'

@Component({
	selector: 'app-dashboard',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucideAngularModule],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class Dashboard {
	readonly LogOutIcon = LogOutIcon

	private readonly authService = inject(AuthService)

	readonly currentUser = this.authService.currentUser

	logout() {
		this.authService.logout()
	}
}
