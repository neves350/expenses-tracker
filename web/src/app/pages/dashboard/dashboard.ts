import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
	selector: 'app-dashboard',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class Dashboard {}
