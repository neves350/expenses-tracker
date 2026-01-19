import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

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

export class CreateWalletDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsEnum(WalletType)
	@IsNotEmpty()
	@ApiProperty({
		enum: [
			'CASH',
			'BANK_ACCOUNT',
			'CREDIT_CARD',
			'DIGITAL_WALLET',
			'INVESTMENT',
		],
	})
	type: WalletType

	@IsEnum(CurrencyType)
	@IsNotEmpty()
	@ApiProperty({ enum: ['EUR', 'USD'] })
	currency: CurrencyType

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	balance: number
}
