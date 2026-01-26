import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ZardButtonComponent } from '../ui/button'

@Component({
	selector: 'app-tabs',
	imports: [ZardButtonComponent, RouterLink, RouterLinkActive],
	templateUrl: './tabs.html',
	styleUrl: './tabs.css',
})
export class Tabs {}
