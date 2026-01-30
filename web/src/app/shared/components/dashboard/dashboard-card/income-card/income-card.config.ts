import type {
	ApexChart,
	ApexDataLabels,
	ApexGrid,
	ApexStroke,
	ApexTooltip,
	ApexXAxis,
	ApexYAxis,
} from 'ng-apexcharts'

export type SparklineChartOptions = {
	series: ApexAxisChartSeries
	chart: ApexChart
	stroke: ApexStroke
	xaxis: ApexXAxis
	yaxis: ApexYAxis
	grid: ApexGrid
	dataLabels: ApexDataLabels
	tooltip: ApexTooltip
	colors: string[]
}

type ApexAxisChartSeries = {
	name?: string
	data: number[]
}[]

function getCssVar(name: string): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function createSparklineChartOptions(
	data: number[],
	labels?: string[],
): Partial<SparklineChartOptions> {
	const expenseColor =
		getCssVar('--income-foreground') || 'oklch(0.577 0.245 27.325)'

	// Default to last N months if no labels provided
	const chartLabels = labels || getLastMonths(data.length)

	return {
		series: [
			{
				name: 'Incomes',
				data: data,
			},
		],
		chart: {
			type: 'line',
			height: 48,
			width: 80,
			sparkline: {
				enabled: true,
			},
			animations: {
				enabled: false,
			},
		},
		colors: [expenseColor],
		stroke: {
			curve: 'smooth',
			width: 2,
		},
		xaxis: {
			categories: chartLabels,
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		grid: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			enabled: true,
			theme: 'dark',
			x: {
				show: true,
			},
			y: {
				formatter: (val: number) => `${val.toFixed(0)}€`,
			},
		},
	}
}

function getLastMonths(count: number): string[] {
	const now = new Date()
	const result: string[] = []
	for (let i = count - 1; i >= 0; i--) {
		const monthIndex = (now.getMonth() - i + 12) % 12
		result.push(MONTHS[monthIndex])
	}
	return result
}
