import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	avatarUrl?: string

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	name?: string

	@IsEmail({}, { message: 'Invalid email' })
	@IsOptional()
	@ApiProperty({ required: false })
	email?: string
}
