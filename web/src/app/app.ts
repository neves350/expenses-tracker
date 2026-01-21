import { Component, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AuthService } from '@core/services/auth/auth-service'

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	protected readonly title = signal('web')
	private readonly authService = inject(AuthService)

	ngOnInit(): void {
		this.authService.checkAuth() // check's if the user is authenticated
	}
}
