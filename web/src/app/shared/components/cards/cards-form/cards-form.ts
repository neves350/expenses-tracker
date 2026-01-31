import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms'
import { CardColor, CardType, CurrencyType } from '@core/api/cards.interface'
import { CardsService } from '@core/services/cards.service'
import { ZardButtonComponent } from '../../ui/button'
import { ZardDividerComponent } from '../../ui/divider'
import { ZardSelectComponent, ZardSelectItemComponent } from '../../ui/select'
import { Z_SHEET_DATA, ZardSheetRef } from '../../ui/sheet'
import { CardsColorPicker } from '../cards-color-picker/cards-color-picker'
import { CardsPreview } from '../cards-preview/cards-preview'
import type { iSheetData } from './cards-form.interface'

@Component({
	selector: 'app-cards-form',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ZardDividerComponent,
		ZardSelectComponent,
		ZardSelectItemComponent,
		CardsColorPicker,
		ZardButtonComponent,
		CardsPreview,
	],
	templateUrl: './cards-form.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsForm implements AfterViewInit {
	private readonly zData: iSheetData = inject(Z_SHEET_DATA)
	private readonly fb = inject(FormBuilder)
	private readonly cardsService = inject(CardsService)
	private readonly sheetRef = inject(ZardSheetRef)

	// Form with default values
	form = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		color: [CardColor.GRAY, [Validators.required]],
		type: [CardType.CASH, [Validators.required]],
		lastFour: [''],
		currency: [CurrencyType.EUR, [Validators.required]],
		balance: [0, [Validators.required, Validators.min(0)]],
	})

	// Enum values for template
	readonly cardTypes = Object.values(CardType)
	readonly currencies = Object.values(CurrencyType)
	readonly colors = Object.values(CardColor)

	// Form values as signal for reactive preview
	private readonly formValues = toSignal(this.form.valueChanges, {
		initialValue: this.form.value,
	})

	// Preview data computed from form values
	readonly previewData = computed(() => ({
		name: this.formValues()?.name || 'Card Name',
		color: this.formValues()?.color || CardColor.GRAY,
		type: this.formValues()?.type || CardType.CASH,
		lastFour: this.formValues()?.lastFour || '',
		currency: this.formValues()?.currency || CurrencyType.EUR,
		balance: this.formValues()?.balance || 0,
	}))

	// Type labels for display
	readonly typeLabels: Record<CardType, string> = {
		[CardType.CASH]: 'Cash',
		[CardType.BANK_ACCOUNT]: 'Bank Account',
		[CardType.CREDIT_CARD]: 'Credit Card',
		[CardType.DIGITAL_WALLET]: 'Digital Wallet',
		[CardType.INVESTMENT]: 'Investment',
	}

	ngAfterViewInit(): void {
		if (this.zData) {
			this.form.patchValue(this.zData)
		}
	}

	getTypeLabel(type: CardType): string {
		return this.typeLabels[type]
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}

		const formValue = this.form.getRawValue()
		this.cardsService.create(formValue).subscribe({
			next: () => {
				this.sheetRef.close()
			},
		})
	}
}
