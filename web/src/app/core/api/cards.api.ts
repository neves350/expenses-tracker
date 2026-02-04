import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import type {
	Card,
	CardActionResponse,
	CardExpensesRequest,
	CreateCardRequest,
	CreateCardResponse,
	UpdateCardRequest,
} from './cards.interface'

@Injectable({
	providedIn: 'root',
})
export class CardsApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/cards`

	/**
	 * CREATE CARD
	 */
	create(data: CreateCardRequest): Observable<CreateCardResponse> {
		return this.http.post<CreateCardResponse>(`${this.baseUrl}`, data, {
			withCredentials: true,
		})
	}

	/**
	 * GET ALL CARDS
	 */
	findAll(): Observable<Card[]> {
		return this.http
			.get<{ cards: Card[]; total: number }>(`${this.baseUrl}`, {
				withCredentials: true,
			})
			.pipe(map((response) => response.cards))
	}

	/**
	 * GET CARD BY ID
	 */
	findById(cardId: string): Observable<Card> {
		return this.http.get<Card>(`${this.baseUrl}/${cardId}`, {
			withCredentials: true,
		})
	}

	/**
	 * UPDATE CARD
	 */
	update(cardId: string, data: UpdateCardRequest): Observable<Card> {
		return this.http
			.patch<{ updatedCard: Card }>(`${this.baseUrl}/${cardId}`, data, {
				withCredentials: true,
			})
			.pipe(map((response) => response.updatedCard))
	}

	/**
	 * DELETE CARD
	 */
	delete(cardId: string): Observable<CardActionResponse> {
		return this.http.delete<CardActionResponse>(`${this.baseUrl}/${cardId}`, {
			withCredentials: true,
		})
	}

	/**
	 * GET MONTHLY EXPENSES
	 */
	monthlyExpenses(cardId: string): Observable<CardExpensesRequest> {
		return this.http.get<CardExpensesRequest>(
			`${this.baseUrl}/${cardId}/expenses`,
			{
				withCredentials: true,
			},
		)
	}
}
