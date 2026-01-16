import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

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
	@ApiPropertyOptional()
	amount: number

	@IsDate()
	@Type(() => Date)
	@IsOptional()
	@ApiPropertyOptional()
	date: Date

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	walletId: string

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	categoryId: string
}
