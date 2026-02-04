import { computed, Injectable, inject, signal } from '@angular/core'
import { BankAccountsApi } from '@core/api/bank-accounts.api'
import type {
	BankAccount,
	CreateBankAccountRequest,
	UpdateBankAccountRequest,
} from '@core/api/bank-accounts.interface'
import { map, Observable, tap } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class BankAccountsService {
	private readonly bankAccountsApi = inject(BankAccountsApi)

	// Signal-based state
	readonly bankAccounts = signal<BankAccount[]>([])
	readonly loading = signal<boolean>(false)
	readonly error = signal<string | null>(null)

	// Computed signals
	readonly hasBankAccounts = computed(() => this.bankAccounts().length > 0)

	loadBankAccounts(): Observable<BankAccount[]> {
		this.loading.set(true)
		this.error.set(null)

		return this.bankAccountsApi.findAll().pipe(
			tap({
				next: (accounts) => {
					this.bankAccounts.set(accounts)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to load bank accounts')
					this.loading.set(false)
				},
			}),
		)
	}

	create(data: CreateBankAccountRequest): Observable<BankAccount> {
		this.loading.set(true)

		return this.bankAccountsApi.create(data).pipe(
			map((response) => response.bankAccount),
			tap({
				next: (bankAccount) => {
					this.bankAccounts.update((current) => [...current, bankAccount])
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to create bank account')
					this.loading.set(false)
				},
			}),
		)
	}

	findById(bankAccountId: string): Observable<BankAccount> {
		return this.bankAccountsApi.findById(bankAccountId)
	}

	update(
		bankAccountId: string,
		data: UpdateBankAccountRequest,
	): Observable<BankAccount> {
		this.loading.set(true)

		return this.bankAccountsApi.update(bankAccountId, data).pipe(
			tap({
				next: (updatedbankAccount) => {
					this.bankAccounts.update((current) =>
						current.map((account) =>
							account.id === bankAccountId ? updatedbankAccount : account,
						),
					)
					this.loading.set(false)
				},
				error: (err) => {
					this.error.set(err.message || 'Failed to update bank account')
					this.loading.set(false)
				},
			}),
		)
	}

	delete(bankAccountId: string): Observable<string> {
		return this.bankAccountsApi
			.delete(bankAccountId)
			.pipe(map((response) => response.message))
	}
}
