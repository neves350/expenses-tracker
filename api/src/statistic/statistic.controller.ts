import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { ByCategoryQueryDto } from './dtos/by-category-query.dto'
import { ByCategoryResponseDto } from './dtos/by-category-response.dto'
import { OverviewResponseDto } from './dtos/overview-response.dto'
import { QueryStatisticsDto } from './dtos/query-statistics.dto'
import { StatisticService } from './statistic.service'

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticController {
	constructor(readonly statisticService: StatisticService) {}

	@UseGuards(JwtAuthGuard)
	@Get('overview')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Finance Overview',
		description:
			'Returns totals, averages, counters, and top 3 expense categories. Useful for main dashboards.',
	})
	async overview(
		@CurrentUser() user,
		@Query() query: QueryStatisticsDto,
	): Promise<OverviewResponseDto> {
		return this.statisticService.getOverview(user.userId, query)
	}

	@UseGuards(JwtAuthGuard)
	@Get('by-category')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Breakdown by category',
		description: 'Groups transactions by category with value and percentages.',
	})
	async byCategory(
		@CurrentUser() user,
		@Query() query: ByCategoryQueryDto,
	): Promise<ByCategoryResponseDto> {
		return this.statisticService.getByCategory(user.userId, query)
	}
}
