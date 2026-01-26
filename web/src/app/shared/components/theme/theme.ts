import { ChangeDetectionStrategy, Component } from '@angular/core'
import { LucideAngularModule, MoonIcon, SunIcon } from 'lucide-angular'
import { ZardButtonComponent } from '../ui/button'

@Component({
	selector: 'app-theme',
	imports: [ZardButtonComponent, LucideAngularModule],
	templateUrl: './theme.html',
	styleUrl: './theme.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Theme {
	darkMode = localStorage.getItem('theme') === 'dark'

	readonly SunIcon = SunIcon
	readonly MoonIcon = MoonIcon

	constructor() {
		document.documentElement.classList.toggle('dark', this.darkMode)
	}

	toggleTheme() {
		this.darkMode = !this.darkMode
		localStorage.setItem('theme', this.darkMode ? 'dark' : 'light')
		document.documentElement.classList.toggle('dark', this.darkMode)
	}
}
