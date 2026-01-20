import { BadRequestException, Injectable } from '@nestjs/common'
import { DeadlinePreset } from '../enums/deadline-preset.enum'

@Injectable()
export class DeadlineService {
	calculateDeadline(preset: DeadlinePreset, customDate?: Date): Date {
		const now = new Date()

		if (preset === DeadlinePreset.CUSTOM) {
			if (!customDate) {
				throw new BadRequestException('Custom deadline required')
			}

			const maxDate = new Date()
			maxDate.setFullYear(maxDate.getFullYear() + 5)

			if (customDate > maxDate) {
				throw new BadRequestException('Deadline cannot exceed 5 years')
			}

			if (customDate <= now) {
				throw new BadRequestException('Deadline must be in the future')
			}

			return customDate
		}

		const deadlineMap = {
			[DeadlinePreset.ONE_WEEK]: () => {
				const date = new Date(now)
				date.setDate(date.getDate() + 7)
				return date
			},
			[DeadlinePreset.ONE_MONTH]: () => {
				const date = new Date(now)
				date.setMonth(date.getMonth() + 1)
				return date
			},
			[DeadlinePreset.ONE_YEAR]: () => {
				const date = new Date(now)
				date.setFullYear(date.getFullYear() + 1)
				return date
			},
		}

		return deadlineMap[preset]()
	}
}
