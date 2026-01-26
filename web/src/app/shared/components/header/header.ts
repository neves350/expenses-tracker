import { Component } from '@angular/core'
import { ProfileButton } from '../profile-button/profile-button'
import { Tabs } from '../tabs/tabs'
import { Theme } from '../theme/theme'
import { ZardAvatarComponent } from '../ui/avatar'
import { ZardDividerComponent } from '../ui/divider'

@Component({
	selector: 'app-header',
	imports: [
		Tabs,
		Theme,
		ZardDividerComponent,
		ProfileButton,
		ZardAvatarComponent,
	],
	templateUrl: './header.html',
	styleUrl: './header.css',
})
export class Header {}
