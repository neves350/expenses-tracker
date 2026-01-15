import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

enum CurrencyType {
	EUR = 'EUR',
	USD = 'USD',
}

enum WalletType {
	CASH = 'CASH',
	BANK_ACCOUNT = 'BANK_ACCOUNT',
	CREDIT_CARD = 'CREDIT_CARD',
	DIGITAL_WALLET = 'DIGITAL_WALLET',
	INVESTMENT = 'INVESTMENT',
}

export class UpdateWalletDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	name?: string

	@IsEnum(WalletType)
	@IsOptional()
	@ApiProperty({
		enum: [
			'CASH',
			'BANK_ACCOUNT',
			'CREDIT_CARD',
			'DIGITAL_WALLET',
			'INVESTMENT',
		],
		required: false,
	})
	type?: WalletType

	@IsEnum(CurrencyType)
	@IsOptional()
	@ApiProperty({ enum: ['EUR', 'USD'], required: false })
	currency?: CurrencyType

	@IsNumber()
	@IsOptional()
	@ApiProperty({ required: false })
	balance?: number
}
