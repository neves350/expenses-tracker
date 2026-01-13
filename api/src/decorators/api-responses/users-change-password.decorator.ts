import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiChangePasswordResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'Password changed successfully',
			schema: {
				example: {
					message: 'Password changed successfully',
					success: true,
				},
			},
		}),
		ApiResponse({
			status: 400,
			description: 'Validation error or passwords do not match',
		}),
		ApiResponse({
			status: 401,
			description: 'Current password is incorrect or invalid token',
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
		}),
	)
}
