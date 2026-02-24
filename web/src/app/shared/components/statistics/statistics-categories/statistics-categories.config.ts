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

export type SemiDonutChartOptions = {
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

function getCssVar(name: string): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

export function createSemiDonutOptions(
	categories: string[],
	amounts: number[],
	_totalTransactions: number,
): Partial<SemiDonutChartOptions> {
	const foreground = getCssVar('--foreground') || 'oklch(0.26 0.05 173)'
	const cardBg = getCssVar('--card') || 'oklch(1 0 0)'
	const mutedForeground =
		getCssVar('--muted-foreground') || 'oklch(0.55 0.02 264)'

	const baseColors = [
		getCssVar('--chart-1') || 'oklch(0.646 0.222 41.116)',
		getCssVar('--chart-2') || 'oklch(0.6 0.118 184.704)',
		getCssVar('--chart-3') || 'oklch(0.398 0.07 227.392)',
		getCssVar('--chart-4') || 'oklch(0.828 0.189 84.429)',
		getCssVar('--chart-5') || 'oklch(0.769 0.188 70.08)',
	]
	const chartColors = categories.map(
		(_, i) => baseColors[i % baseColors.length],
	)

	const total = amounts.reduce((sum, val) => sum + val, 0)

	return {
		series: amounts,
		chart: {
			type: 'donut',
			height: 380,
			fontFamily: 'inherit',
			foreColor: foreground,
			background: 'transparent',
		},
		labels: categories,
		colors: chartColors,
		plotOptions: {
			pie: {
				startAngle: -90,
				endAngle: 90,
				donut: {
					size: '80%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Total',
							fontSize: '13px',
							color: mutedForeground,
							formatter: () =>
								`${total.toLocaleString('pt-PT', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})} €`,
						},
						value: {
							show: true,
							fontSize: '22px',
							fontWeight: 700,
							color: foreground,
							offsetY: -10,
							formatter: (val: string) => {
								const num = Number.parseFloat(val)
								return `${num.toLocaleString('pt-PT', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})} €`
							},
						},
						name: {
							show: true,
							offsetY: -25,
							fontSize: '13px',
							color: mutedForeground,
						},
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
			offsetY: -50,
			labels: {
				colors: foreground,
			},
			markers: {
				shape: 'circle',
				strokeWidth: 1,
				offsetX: -4,
			},
			formatter: (seriesName: string, opts) => {
				const value = opts.w.globals.series[opts.seriesIndex]
				const percentage = ((value / total) * 100).toFixed(1)
				return `${seriesName}: ${percentage}%`
			},
			itemMargin: {
				horizontal: 18,
				vertical: 15,
			},
		},
		stroke: {
			show: true,
			width: 5,
			colors: [cardBg],
		},
		tooltip: {
			theme: 'dark',
			style: {
				fontSize: '12px',
			},
			y: {
				formatter: (value: number) =>
					`${value.toLocaleString('pt-PT', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})} €`,
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						height: 280,
					},
				},
			},
		],
	}
}
