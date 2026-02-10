import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ProfileButton } from '../profile-button/profile-button'
import { ZardAvatarComponent } from '../ui/avatar'
import { ZardButtonComponent } from '../ui/button'
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
		ZardButtonComponent,
		RouterLink,
	],
	templateUrl: './sidebar.html',
})
export class Sidebar {}
