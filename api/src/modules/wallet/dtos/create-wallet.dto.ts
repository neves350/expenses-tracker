import { ApiProperty } from '@nestjs/swagger'
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

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

enum WalletColor {
	GRAY = 'GRAY',
	RED = 'RED',
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	PURPLE = 'PURPLE',
	ORANGE = 'ORANGE',
	YELLOW = 'YELLOW',
	PINK = 'PINK',
}

export class CreateWalletDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsEnum(WalletColor)
	@IsNotEmpty()
	@ApiProperty({
		enum: [
			'GRAY',
			'RED',
			'GREEN',
			'BLUE',
			'PURPLE',
			'ORANGE',
			'YELLOW',
			'PINK',
		],
	})
	color: WalletColor

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

	@IsString()
	@IsOptional()
	@ApiProperty()
	lastFour?: string

	@IsEnum(CurrencyType)
	@IsNotEmpty()
	@ApiProperty({ enum: ['EUR', 'USD'] })
	currency: CurrencyType

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	balance: number
}
