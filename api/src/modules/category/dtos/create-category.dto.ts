import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

enum CategoryType {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE',
}

export class CreateCategory {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	title: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	icon: string

	@IsEnum(CategoryType)
	@IsNotEmpty()
	@ApiProperty({ enum: ['INCOME', 'EXPENSE'] })
	type: CategoryType
}
