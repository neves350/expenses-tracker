import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	ValidateIf,
} from 'class-validator'
import { DeadlinePreset } from '../enums/deadline-preset.enum'

export class UpdateGoalDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ example: 'Holidays 2026', description: 'Goal title' })
	title?: string

	@IsNumber()
	@IsOptional()
	@IsPositive({ message: 'Amount must be greater than 0' })
	@ApiPropertyOptional({ example: 5000, description: 'Target amount to save' })
	amount?: number

	@IsEnum(DeadlinePreset)
	@IsOptional()
	@ApiPropertyOptional({
		enum: DeadlinePreset,
		description: 'Preset deadline or custom',
	})
	deadlinePreset?: DeadlinePreset

	@Type(() => Date)
	@IsDate()
	@ValidateIf((o) => o.deadlinePreset === DeadlinePreset.CUSTOM)
	@IsNotEmpty({ message: 'Custom deadline is required when preset is CUSTOM' })
	@ApiPropertyOptional({
		description:
			'Custom deadline (required if preset is CUSTOM, max 5 years from now)',
	})
	customDeadline?: Date
}
