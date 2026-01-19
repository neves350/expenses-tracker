import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

/**
 * Export Transaction Csv
 */
export function ApiExportCsvResponses() {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: 'CSV file downloaded successfully',
		}),
		ApiResponse({
			status: 401,
			description: 'Unauthorized',
		}),
	)
}
