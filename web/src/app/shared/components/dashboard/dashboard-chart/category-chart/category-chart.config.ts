import type {
	ApexChart,
	ApexDataLabels,
	ApexLegend,
	ApexNonAxisChartSeries,
	ApexPlotOptions,
	ApexResponsive,
	ApexStroke,
	ApexTooltip,
} from 'ng-apexcharts'

export type DonutChartOptions = {
	series: ApexNonAxisChartSeries
	chart: ApexChart
	labels: string[]
	colors: string[]
	legend: ApexLegend
	plotOptions: ApexPlotOptions
	dataLabels: ApexDataLabels
	tooltip: ApexTooltip
	stroke: ApexStroke
	responsive: ApexResponsive[]
}

/**
 * Gets computed CSS variable value from the document
 */
function getCssVar(name: string): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

/**
 * Creates donut chart options with theme-aware colors
 * Call this in afterNextRender or when theme changes to get updated colors
 */
export function createDonutChartOptions(
	categories: string[],
	amounts: number[],
): Partial<DonutChartOptions> {
	const foreground = getCssVar('--foreground') || 'oklch(0.26 0.05 173)'
	const cardBg = getCssVar('--card') || 'oklch(1 0 0)'

	// Use chart-1 through chart-5 for the 5 category colors
	const chartColors = [
		getCssVar('--chart-1') || 'oklch(0.646 0.222 41.116)',
		getCssVar('--chart-2') || 'oklch(0.6 0.118 184.704)',
		getCssVar('--chart-3') || 'oklch(0.398 0.07 227.392)',
		getCssVar('--chart-4') || 'oklch(0.828 0.189 84.429)',
		getCssVar('--chart-5') || 'oklch(0.769 0.188 70.08)',
	]

	const total = amounts.reduce((sum, val) => sum + val, 0)

	return {
		series: amounts,
		chart: {
			type: 'donut',
			height: 450,
			fontFamily: 'inherit',
			foreColor: foreground,
			background: 'transparent',
		},
		labels: categories,
		colors: chartColors,
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: false,
					},
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: 'bottom',
			horizontalAlign: 'center',
			fontSize: '14px',
			labels: {
				colors: foreground,
			},
			markers: {
				offsetX: -4,
				customHTML: () =>
					'<span style="display:inline-block;width:3px;height:12px;background:currentColor;vertical-align:middle;margin:0 6px;"></span>',
			},
			formatter: (seriesName: string, opts) => {
				const value = opts.w.globals.series[opts.seriesIndex]
				const percentage = ((value / total) * 100).toFixed(1)

				return `${seriesName}:  ${percentage}%`
			},
			itemMargin: {
				horizontal: 12,
				vertical: 8,
			},
		},
		stroke: {
			show: true,
			width: 12,
			colors: [cardBg],
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
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						height: 300,
					},
				},
			},
		],
	}
}
