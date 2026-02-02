import { ApiProperty } from '@nestjs/swagger'
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
} from 'class-validator'
import { BankCurrency, BankType } from 'src/generated/prisma/client'

export class CreateBankAccountDto {
	@ApiProperty({ example: 'Revolut Credit Card' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ enum: BankType, example: 'CHECKING' })
	@IsEnum(BankType)
	@IsNotEmpty()
	type: BankType

	@ApiProperty({ enum: BankCurrency, example: 'EUR' })
	@IsEnum(BankCurrency)
	@IsNotEmpty()
	currency: BankCurrency

	@ApiProperty()
	@IsNumber()
	@IsPositive({ message: 'Amount must be greater than 0' })
	@IsNotEmpty()
	balance: number
}
