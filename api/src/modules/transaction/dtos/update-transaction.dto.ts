import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDate,
	IsEnum,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	MaxDate,
} from 'class-validator'

enum TransactionType {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE',
}

export class UpdateTransactionDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	title?: string

	@IsEnum(TransactionType)
	@IsOptional()
	@ApiPropertyOptional({ enum: TransactionType })
	type: TransactionType

	@IsNumber()
	@IsOptional()
	@IsPositive({ message: 'Amount must be greater than 0' })
	@ApiPropertyOptional()
	amount: number

	@Type(() => Date)
	@IsOptional()
	@IsDate()
	@MaxDate(new Date(), { message: 'Date cannot be in the future' })
	@ApiPropertyOptional()
	date: Date

	@IsString()
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional()
	cardId: string

	@IsString()
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional()
	categoryId: string
}
