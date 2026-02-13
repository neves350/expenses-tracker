import { DatePipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { GoalsService } from '@core/services/goals.service'
import { CalendarIcon, LucideAngularModule } from 'lucide-angular'
import { ZardCardComponent } from '../../ui/card'
import { ZardDatePickerComponent } from '../../ui/date-picker'
import { Z_MODAL_DATA, ZardDialogRef } from '../../ui/dialog'
import { ZardDividerComponent } from '../../ui/divider'
import { ZardInputDirective } from '../../ui/input'
import { ZardProgressBarComponent } from '../../ui/progress-bar'
import type { iDepositSheetData } from './goals-deposit-form.interface'

@Component({
	selector: 'app-goals-deposit-form',
	imports: [
		ReactiveFormsModule,
		ZardDatePickerComponent,
		ZardInputDirective,
		ZardCardComponent,
		ZardProgressBarComponent,
		LucideAngularModule,
		DatePipe,
		ZardDividerComponent,
	],
	templateUrl: './goals-deposit-form.html',
})
export class GoalsDepositForm {
	private readonly goalsService = inject(GoalsService)
	private readonly zData: iDepositSheetData = inject(Z_MODAL_DATA)
	private readonly dialogRef = inject(ZardDialogRef)
	private readonly fb = inject(FormBuilder)

	readonly CalendarIcon = CalendarIcon
	readonly selectedDate: Date | null = new Date()
	readonly goal = this.zData?.goal

	get formattedRemaining(): string {
		if (!this.goal) return ''
		const remaining = this.goal.amount - this.goal.currentAmount
		const currency = this.goal.bankAccount?.currency ?? 'EUR'
		return new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
		}).format(Math.max(0, remaining))
	}

	form = this.fb.nonNullable.group({
		amount: [0 as number | null, [Validators.required, Validators.min(0.01)]],
		date: ['', [Validators.required]],
		note: [''],
	})

	constructor() {
		// Initialize date with the default selectedDate
		if (this.selectedDate) {
			this.form.controls.date.setValue(this.selectedDate.toISOString())
		}

		if (this.zData) {
			const patch: { amount?: number; date?: string; note?: string } = {}

			if (typeof this.zData.amount === 'number')
				patch.amount = this.zData.amount
			if (this.zData.date) patch.date = this.zData.date
			if (this.zData.note) patch.note = this.zData.note

			this.form.patchValue(patch)
		}
	}

	onDateChange(date: Date | null) {
		this.form.controls.date.setValue(date ? date.toISOString() : '')
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}

		const goalId = this.zData?.id
		if (!goalId) return

		const formValue = this.form.getRawValue()
		const payload = {
			amount: Number(formValue.amount) || 0,
			date: formValue.date,
			note: formValue.note,
		}

		this.goalsService.addDeposit(goalId, payload).subscribe({
			next: () => this.dialogRef.close(),
		})
	}
}
