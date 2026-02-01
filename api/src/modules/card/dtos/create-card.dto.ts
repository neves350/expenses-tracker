import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Max,
	Min,
	ValidateIf,
} from 'class-validator'
import { CardColor, CardType } from 'src/generated/prisma/client'

export class CreateCardDto {
	@ApiProperty({ example: 'Nubank Credit Card' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ enum: CardColor, example: 'PURPLE' })
	@IsEnum(CardColor)
	@IsNotEmpty()
	color: CardColor

	@ApiProperty({ enum: CardType, example: 'CREDIT_CARD' })
	@IsEnum(CardType)
	@IsNotEmpty()
	type: CardType

	@ApiPropertyOptional({ example: '1234', description: 'Last 4 digits' })
	@IsString()
	@IsOptional()
	@Length(4, 4)
	lastFour?: string

	@ApiPropertyOptional({ example: 5000.0, description: 'Credit limit' })
	@ValidateIf((o) => o.type === CardType.CREDIT_CARD)
	@IsNumber()
	@IsOptional()
	creditLimit?: number

	@ApiPropertyOptional({ example: 15, description: 'Invoice closing day (1-31)' })
	@ValidateIf((o) => o.type === CardType.CREDIT_CARD)
	@IsInt()
	@Min(1)
	@Max(31)
	@IsOptional()
	closingDay?: number

	@ApiPropertyOptional({ example: 25, description: 'Invoice due day (1-31)' })
	@ValidateIf((o) => o.type === CardType.CREDIT_CARD)
	@IsInt()
	@Min(1)
	@Max(31)
	@IsOptional()
	dueDay?: number
}
