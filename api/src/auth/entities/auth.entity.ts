import { ApiProperty } from '@nestjs/swagger'

/**
 * jwt shape
 */
export class AuthEntity {
	@ApiProperty()
	token: string
}
