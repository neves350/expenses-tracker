import { ApiResponse } from '@nestjs/swagger'

export function ApiAuthSuccessResponse() {
	return ApiResponse({
		status: 200,
		description: 'User successfully logged in',
		schema: {
			example: {
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
			},
		},
	})
}

export function ApiProfileResponse() {
	return ApiResponse({
		status: 200,
		description: 'Profile retrieved successfully',
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

export function ApiCreateResponse() {
	return ApiResponse({
		status: 201,
		description: 'User successfully registered',
		schema: {
			example: {
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
				user: {
					id: 'f93fc60c-4018-4ac0-8606-efd160076df6',
					name: 'John Doe',
					email: 'john@example.com',
				},
			},
		},
	})
}

export function ApiBadRequestResponse() {
	return ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid input',
		schema: {
			example: {
				statusCode: 400,
				message: [
					'email must be an email',
					'password must be longer than 6 characters',
				],
				error: 'Bad Request',
			},
		},
	})
}

export function ApiUnauthorizedResponse() {
	return ApiResponse({
		status: 401,
		description: 'Unauthorized - Invalid credentials',
		schema: {
			example: {
				statusCode: 401,
				message: 'Invalid credentials',
				error: 'Unauthorized',
			},
		},
	})
}
