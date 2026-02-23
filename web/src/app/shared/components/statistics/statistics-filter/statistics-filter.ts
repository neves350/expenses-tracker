import { Component, output, signal } from '@angular/core'
import {
	PeriodType,
	type StatisticsQueryParams,
} from '@core/api/statistics.interface'
import { CalendarDaysIcon } from 'lucide-angular'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'

@Component({
	selector: 'app-statistics-filter',
	imports: [ZardSelectItemComponent, ZardSelectComponent],
	templateUrl: './statistics-filter.html',
})
export class StatisticsFilter {
	readonly period = signal<PeriodType>(PeriodType.MONTH)
	readonly CalendarDaysIcon = CalendarDaysIcon

	readonly filterChange = output<StatisticsQueryParams>()

	onPeriodChange(value: string | string[]) {
		this.period.set(value as PeriodType)
		this.emitFilter()
	}

	private emitFilter() {
		this.filterChange.emit({
			period: this.period(),
		})
	}
}
