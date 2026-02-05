import { computed, Injectable, inject, signal } from '@angular/core'
import { TransfersApi } from '@core/api/transfers.api'
import type {
	CreateTransferRequest,
	Transfer,
	TransfersQueryParams,
} from '@core/api/transfers.interface'
import { map, Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class TransfersService {
	private readonly transfersApi = inject(TransfersApi)

	// Signal-based state
	readonly transfers = signal<Transfer[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	// Computed signals
	readonly hasTransfers = computed(() => this.transfers().length > 0)

	loadTransfers(params?: TransfersQueryParams): Observable<Transfer[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.transfersApi.findAll(params).pipe(
			tap({
				next: (response) => {
					this.transfers.set(response.data)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to load transfers')
					this.loading.set(false)
				},
			}),
			map((response) => response.data),
		)
	}

	create(data: CreateTransferRequest): Observable<Transfer> {
		this.loading.set(true)

		return this.transfersApi.create(data).pipe(
			map((response) => response.transfer),
			tap({
				next: (transfer) => {
					this.transfers.update((current) => [...current, transfer])
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to create transfers')
					this.loading.set(false)
				},
			}),
		)
	}

	findById(transferId: string): Observable<Transfer> {
		return this.transfersApi.findById(transferId)
	}
}
