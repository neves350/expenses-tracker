import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty({ message: 'Required token' })
	@ApiProperty()
	code: string

	@IsString()
	@MinLength(6, { message: 'Password must be least 6 characters' })
	@IsNotEmpty({ message: 'Required new password' })
	@ApiProperty()
	newPassword: string
}
