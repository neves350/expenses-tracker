import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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

export enum DeadlinePreset {
	ONE_WEEK = '1_week',
	ONE_MONTH = '1_month',
	ONE_YEAR = '1_year',
	CUSTOM = 'custom',
}

export class CreateGoalDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'Holidays 2026' })
	title: string

	@IsNumber()
	@IsNotEmpty()
	@IsPositive({ message: 'Amount must be greater than 0' })
	@ApiProperty({ example: 5000 })
	amount: number

	@IsEnum(DeadlinePreset)
	@IsOptional()
	@ApiPropertyOptional({ enum: DeadlinePreset })
	deadlinePreset?: DeadlinePreset

	@Type(() => Date)
	@IsDate()
	@ValidateIf((o) => o.deadlinePreset === DeadlinePreset.CUSTOM)
	@IsNotEmpty({ message: 'Custom deadline is required when preset is CUSTOM' })
	@ApiPropertyOptional()
	customDeadline?: Date
}
