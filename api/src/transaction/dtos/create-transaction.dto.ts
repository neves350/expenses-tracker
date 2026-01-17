import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	IsUUID,
	MaxDate,
} from 'class-validator'

enum TransactionType {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	title: string

	@IsEnum(TransactionType)
	@IsNotEmpty()
	@ApiProperty({ enum: TransactionType })
	type: TransactionType

	@IsNumber()
	@IsNotEmpty()
	@IsPositive({ message: 'Amount must be greater than 0' })
	@ApiProperty()
	amount: number

	@Type(() => Date)
	@IsNotEmpty()
	@IsDate()
	@MaxDate(new Date(), { message: 'Date cannot be in the future' })
	@ApiProperty()
	date: Date

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	walletId: string

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	categoryId: string
}
