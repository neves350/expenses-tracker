import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
	@IsString()
	@MinLength(6, { message: 'Current password must be at least 6 characters' })
	@ApiProperty()
	currentPassword: string

	@IsString()
	@MinLength(6, { message: 'New password must be at least 6 characters' })
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
	//   message: 'New password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
	// })
	@ApiProperty()
	newPassword: string

	@IsString()
	@MinLength(6, {
		message: 'Password confirmation must be at least 6 characters',
	})
	@ApiProperty()
	confirmPassword: string
}
