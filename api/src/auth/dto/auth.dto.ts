import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginUserDTO {
	@IsEmail()
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@ApiProperty()
	passwordHash: string
}

export class RegisterUserDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string

	@IsEmail()
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@ApiProperty()
	passwordHash: string
}

export class UpdatePasswordDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	newPassword: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	oldPassword: string
}
