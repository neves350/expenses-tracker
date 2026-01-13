import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginUserDto {
	@IsEmail({}, { message: 'Invalid email' })
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@ApiProperty()
	password: string
}

export class RegisterUserDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string

	@IsEmail({}, { message: 'Invalid email' })
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@ApiProperty()
	password: string
}
