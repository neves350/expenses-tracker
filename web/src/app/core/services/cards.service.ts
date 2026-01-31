import { computed, Injectable, inject, signal } from '@angular/core'
import { CardsApi } from '@core/api/cards.api'
import type {
	Card,
	CreateCardRequest,
	UpdateCardRequest,
} from '@core/api/cards.interface'
import { map, Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class CardsService {
	private readonly cardsApi = inject(CardsApi)

	// Signal-based state
	readonly cards = signal<Card[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	// Computed signals
	readonly hasCards = computed(() => this.cards().length > 0)
	readonly totalBalance = computed(() =>
		this.cards().reduce((sum, w) => sum + Number(w.balance), 0),
	)
	readonly creditCards = computed(() =>
		this.cards().filter((w) => w.type === 'CREDIT_CARD'),
	)
	readonly creditCardsCount = computed(() => this.creditCards().length)
	readonly hasCreditCards = computed(() => this.creditCardsCount() > 0)

	loadCards(): Observable<Card[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.cardsApi.findAll().pipe(
			tap({
				next: (wallets) => {
					this.cards.set(wallets)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to load wallets')
					this.loading.set(false)
				},
			}),
		)
	}

	create(data: CreateCardRequest): Observable<Card> {
		this.loading.set(true)

		return this.cardsApi.create(data).pipe(
			map((response) => response.wallet),
			tap({
				next: (wallet) => {
					this.cards.update((current) => [...current, wallet])
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to create card')
					this.loading.set(false)
				},
			}),
		)
	}

	findById(cardId: string): Observable<Card> {
		return this.cardsApi.findById(cardId)
	}

	update(cardId: string, data: UpdateCardRequest): Observable<Card> {
		return this.cardsApi.update(cardId, data)
	}

	delete(cardId: string): Observable<string> {
		return this.cardsApi
			.delete(cardId)
			.pipe(map((response) => response.message))
	}
}
