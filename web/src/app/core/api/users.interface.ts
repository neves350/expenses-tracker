/**
 * USER
 */
export interface User {
	id: string
	name: string
	email: string
	avatarUrl: string | null
	createdAt: string
	updatedAt: string
}

/**
 * UPDATE USER
 */
export interface UpdateUserRequest {
	name?: string
	email?: string
	avatarUrl?: string
}

/**
 * CHANGE PASSWORD
 */
export interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

/**
 * GENERIC RESPONSE
 */
export interface UserActionResponse {
	message: string
	success: boolean
}
