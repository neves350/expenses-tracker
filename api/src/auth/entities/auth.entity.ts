import { ApiProperty } from '@nestjs/swagger'

/**
 * jwt shape
 */
export class AuthEntity {
	@ApiProperty()
	acessToken: string

	@ApiProperty()
	refreshToken: string
}
