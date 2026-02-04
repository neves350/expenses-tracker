import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { BankCurrency, BankType } from '@core/api/bank-accounts.interface'
import { BankAccountsService } from '@core/services/bank-accounts.service'
import { ZardButtonComponent } from '../../ui/button'
import { ZardDividerComponent } from '../../ui/divider'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'
import { Z_SHEET_DATA, ZardSheetRef } from '../../ui/sheet'
import type { iSheetData } from './bank-account-form.interface'

@Component({
	selector: 'app-bank-accounts-form',
	imports: [
		ZardDividerComponent,
		ZardSelectComponent,
		ZardSelectItemComponent,
		ZardButtonComponent,
		ReactiveFormsModule,
	],
	templateUrl: './bank-accounts-form.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountsForm {
	private readonly zData: iSheetData = inject(Z_SHEET_DATA)
	private readonly fb = inject(FormBuilder)
	private readonly bankAccountsService = inject(BankAccountsService)
	private readonly sheetRef = inject(ZardSheetRef)

	// Form with default values
	form = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		type: [BankType.CHECKING, [Validators.required]],
		currency: [BankCurrency.EUR, [Validators.required]],
		balance: [0 as number | null],
	})

	readonly isEditMode = computed(() => !!this.zData?.id)

	// Enum values for template
	readonly bankAccountTypes = Object.values(BankType)
	readonly bankAccountCurrencies = Object.values(BankCurrency)

	// Form values as signal for reactive preview
	private readonly formValues = toSignal(this.form.valueChanges, {
		initialValue: this.form.value,
	})

	// Preview data computed from form values
	readonly previewData = computed(() => ({
		name: this.formValues()?.name || 'Account Name',
		type: this.formValues()?.type || BankType.CHECKING,
		currency: this.formValues()?.type || BankCurrency.EUR,
		balance: this.formValues()?.balance ?? 0,
	}))

	// Type labels for display
	readonly typeLabels: Record<BankType, string> = {
		[BankType.WALLET]: 'Wallet',
		[BankType.CHECKING]: 'Checking',
		[BankType.SAVINGS]: 'Savings',
		[BankType.INVESTMENT]: 'Investment',
	}

	readonly typeCurrenct: Record<BankCurrency, string> = {
		[BankCurrency.EUR]: 'Eur',
		[BankCurrency.USD]: 'Usd',
	}

	getTypeLabel(type: BankType): string {
		return this.typeLabels[type]
	}

	getCurrencyLabel(type: BankCurrency): string {
		return this.typeCurrenct[type]
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}

		const formValue = this.form.getRawValue()
		const payload = {
			name: formValue.name,
			type: formValue.type,
			currency: formValue.currency,
			balance: Number(formValue.balance) || 0,
		}

		const request$ = this.zData?.id
			? this.bankAccountsService.update(this.zData.id, payload)
			: this.bankAccountsService.create(payload)

		request$.subscribe({
			next: () => this.sheetRef.close(),
		})
	}
}
