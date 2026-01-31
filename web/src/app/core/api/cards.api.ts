import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import type {
	Card,
	CardActionResponse,
	CreateCardRequest,
	CreateCardResponse,
	UpdateCardRequest,
} from './cards.interface'

@Injectable({
	providedIn: 'root',
})
export class CardsApi {
	private readonly http = inject(HttpClient)
	private readonly baseUrl = `${environment.apiUrl}/wallets`

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
		return this.http.get<Card[]>(`${this.baseUrl}`, {
			withCredentials: true,
		})
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
		return this.http.patch<Card>(`${this.baseUrl}/${cardId}`, data, {
			withCredentials: true,
		})
	}

	/**
	 * DELETE CARD
	 */
	delete(cardId: string): Observable<CardActionResponse> {
		return this.http.delete<CardActionResponse>(`${this.baseUrl}/${cardId}`, {
			withCredentials: true,
		})
	}
}
