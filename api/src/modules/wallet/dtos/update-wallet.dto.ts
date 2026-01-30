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

export class UpdateWalletDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	name?: string

	@IsEnum(WalletColor)
	@IsOptional()
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
		required: false,
	})
	color?: WalletColor

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

	@IsString()
	@IsOptional()
	@ApiProperty()
	lastFour?: string

	@IsEnum(CurrencyType)
	@IsOptional()
	@ApiProperty({ enum: ['EUR', 'USD'], required: false })
	currency?: CurrencyType

	@IsNumber()
	@IsOptional()
	@ApiProperty({ required: false })
	balance?: number
}
