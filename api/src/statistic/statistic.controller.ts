import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
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
}
