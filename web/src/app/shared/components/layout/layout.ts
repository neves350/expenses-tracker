import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Header } from '../header/header'

@Component({
	selector: 'app-layout',
	imports: [Header, RouterOutlet],
	templateUrl: './layout.html',
	styleUrl: './layout.css',
})
export class Layout {}
