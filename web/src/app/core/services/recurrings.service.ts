import { computed, Injectable, inject, signal } from '@angular/core'
import { RecurringsApi } from '@core/api/recurrings.api'
import type {
	CreateRecurringRequest,
	Recurring,
	UpdateRecurringRequest,
} from '@core/api/recurrings.interface'
import { map, Observable, switchMap, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class RecurringsService {
	private readonly recurringsApi = inject(RecurringsApi)

	readonly recurrings = signal<Recurring[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)
	readonly hasRecurrings = computed(() => this.recurrings().length > 0)

	loadRecurrings(): Observable<Recurring[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.recurringsApi.findAll().pipe(
			tap({
				next: (response) => {
					this.recurrings.set(response.recurrings)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(
						err.message || 'Failed to load recurrings transactions',
					)
					this.loading.set(false)
				},
			}),
			map((response) => response.recurrings),
		)
	}

	create(data: CreateRecurringRequest): Observable<Recurring> {
		this.loading.set(true)

		return this.recurringsApi.create(data).pipe(
			map((response) => response.recurring),
			switchMap((recurring) =>
				this.loadRecurrings().pipe(map(() => recurring)),
			),
		)
	}

	update(
		recurringId: string,
		data: UpdateRecurringRequest,
	): Observable<Recurring> {
		this.loading.set(true)

		return this.recurringsApi
			.update(recurringId, data)
			.pipe(
				switchMap((updatedRecurring) =>
					this.loadRecurrings().pipe(map(() => updatedRecurring)),
				),
			)
	}

	delete(recurringId: string): Observable<string> {
		this.loading.set(true)

		return this.recurringsApi
			.delete(recurringId)
			.pipe(
				switchMap((response) =>
					this.loadRecurrings().pipe(map(() => response.message)),
				),
			)
	}
}
