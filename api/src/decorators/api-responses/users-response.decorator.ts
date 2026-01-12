import { ApiResponse } from '@nestjs/swagger'

export function ApiOkResponse() {
	return ApiResponse({
		status: 200,
		description: 'User found successfully',
		schema: {
			example: {
				id: 'f93fc60c-4018-4ac0-8606-efd160076df6',
				name: 'John Doe',
				avatarUrl: 'default.png',
				email: 'john@example.com',
				createdAt: '2024-01-15T10:30:00Z',
				updatedAt: '2024-01-15T10:30:00Z',
			},
		},
	})
}

export function ApiUnauthorizedResponse() {
	return ApiResponse({
		status: 401,
		description: 'Not authenticated or invalid token',
	})
}

export function ApiForbiddenResponse() {
	return ApiResponse({
		status: 403,
		description: 'Cannot access data from other users',
	})
}

export function ApiNotFoundResponse() {
	return ApiResponse({
		status: 404,
		description: 'User not found',
	})
}
