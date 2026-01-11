import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
	@IsEmail({}, { message: 'Invalid email' })
	@IsNotEmpty({ message: 'Required email' })
	@ApiProperty()
	email: string
}
