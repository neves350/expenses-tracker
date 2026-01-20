import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreateDepositDto {
	@IsNumber()
	@IsNotEmpty()
	@IsPositive({ message: 'Deposit amount must be greater than 0' })
	@ApiProperty({
		example: 50,
		description: 'Amount to deposit towards the goal',
	})
	amount: number
}
