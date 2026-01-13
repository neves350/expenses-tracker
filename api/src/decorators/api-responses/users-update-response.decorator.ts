import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

export function ApiUpdateByIdResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'User successfully updated',
			schema: {
				example: {
					id: 'f93fc60c-4018-4ac0-8606-efd160076df6',
					name: 'John Doe Updated',
					avatarUrl: 'new-avatar.png',
					email: 'newemail@example.com',
				},
			},
		}),
		ApiResponse({
			status: 401,
			description: 'Invalid or missing token',
		}),
		ApiResponse({
			status: 403,
			description: 'You can only update your own profile',
		}),
		ApiResponse({
			status: 404,
			description: 'User not found',
		}),
		ApiResponse({
			status: 409,
			description: 'Email already exists',
		}),
	)
}
