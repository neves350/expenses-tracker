import type {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexFill,
	ApexGrid,
	ApexLegend,
	ApexMarkers,
	ApexStroke,
	ApexTooltip,
	ApexXAxis,
	ApexYAxis,
} from 'ng-apexcharts'

export type ChartOptions = {
	series: ApexAxisChartSeries
	chart: ApexChart
	xaxis: ApexXAxis
	yaxis: ApexYAxis
	stroke: ApexStroke
	tooltip: ApexTooltip
	dataLabels: ApexDataLabels
	fill: ApexFill
	grid: ApexGrid
	legend: ApexLegend
	markers: ApexMarkers
	colors: string[]
}

export const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
] as const

/**
 * Gets computed CSS variable value from the document
 */
function getCssVar(name: string): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

/**
 * Creates chart options with theme-aware colors
 * Call this in ngOnInit or when theme changes to get updated colors
 */
export function createChartOptions(
	incomeData: number[],
	expenseData: number[],
): Partial<ChartOptions> {
	const foreground = getCssVar('--foreground') || 'oklch(0.26 0.05 173)'
	const border = getCssVar('--border') || 'oklch(0.92 0.004 286.32)'
	const _card = getCssVar('--card') || 'oklch(1 0 0)'
	const chartColor1 = getCssVar('--chart-5') || 'oklch(0.646 0.222 41.116)'
	const chartColor2 = getCssVar('--chart-2') || 'oklch(0.6 0.118 184.704)'

	return {
		series: [
			{
				name: 'Income',
				data: incomeData,
			},
			{
				name: 'Expense',
				data: expenseData,
			},
		],
		chart: {
			height: 450,
			type: 'area',
			toolbar: {
				show: false,
			},
			fontFamily: 'inherit',
			foreColor: foreground,
			background: 'transparent',
		},
		colors: [chartColor2, chartColor1],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
			width: 3,
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.4,
				opacityTo: 0.1,
				stops: [0, 90, 100],
			},
		},
		markers: {
			size: 4,
			strokeWidth: 2,
			hover: {
				size: 6,
			},
		},
		xaxis: {
			type: 'category',
			categories: [...MONTHS],
			labels: {
				style: {
					colors: foreground,
					fontSize: '12px',
				},
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
				style: {
					colors: foreground,
					fontSize: '12px',
				},
				formatter: (value: number) => `${value.toLocaleString()}€`,
			},
		},
		grid: {
			borderColor: border,
			strokeDashArray: 4,
			xaxis: {
				lines: {
					show: false,
				},
			},
		},
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			fontSize: '14px',
			labels: {
				colors: foreground,
			},
			markers: {
				offsetX: -4,
				customHTML: () =>
					'<span style="display:inline-block;width:3px;height:12px;background:currentColor;vertical-align:middle;margin:0 6px;"></span>',
			},
			itemMargin: {
				horizontal: 12,
			},
		},
		tooltip: {
			theme: 'dark',
			style: {
				fontSize: '12px',
			},
			y: {
				formatter: (value: number) => `${value.toLocaleString()}€`,
			},
		},
	}
}
