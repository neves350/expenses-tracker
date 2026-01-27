import { Component } from '@angular/core'
import { ProfileButton } from '../profile-button/profile-button'
import { ZardAvatarComponent } from '../ui/avatar'
import { ZardDividerComponent } from '../ui/divider'
import { HlmSidebarImports } from '../ui/spartan/sidebar/src'
import { SidebarGroup } from './sidebar-group/sidebar-group'

@Component({
	selector: 'app-sidebar',
	imports: [
		ZardAvatarComponent,
		HlmSidebarImports,
		ZardDividerComponent,
		ProfileButton,
		SidebarGroup,
	],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.css',
})
export class Sidebar {}
