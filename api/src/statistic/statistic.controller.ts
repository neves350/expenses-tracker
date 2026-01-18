import { Controller } from '@nestjs/common'
import { StatisticService } from './statistic.service'

@Controller('statistic')
export class StatisticController {
	constructor(readonly _statisticService: StatisticService) {}
}
