import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
	@ApiProperty()
	amount: number

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	@ApiProperty()
	date: Date

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	walletId: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	categoryId: string
}
