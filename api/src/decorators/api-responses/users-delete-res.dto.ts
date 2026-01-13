import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiDeleteResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Profile deleted successfully',
			schema: {
				example: {
					message: 'Profile deleted successfully',
					success: true,
				},
			},
		}),
		ApiResponse({
			status: 401,
			description: 'Not authenticated or invalid token',
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
		}),
	)
}
