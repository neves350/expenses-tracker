import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator'

export enum TransactionType {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE',
}

export class QueryTransactionDto {
	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	cardId?: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	accountId?: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	categoryId?: string

	@IsOptional()
	@IsEnum(TransactionType)
	@ApiPropertyOptional({ enum: TransactionType })
	type?: TransactionType

	@IsOptional()
	@IsDateString()
	@ApiPropertyOptional()
	startDate?: string

	@IsOptional()
	@IsDateString()
	@ApiPropertyOptional()
	endDate?: string

	@IsOptional()
	@Type(() => Number) // convert string to number
	@IsInt()
	@Min(1)
	@ApiPropertyOptional()
	page?: number = 1 // default value

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@ApiPropertyOptional()
	limit?: number = 20 // default value
}
