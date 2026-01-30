import type {
	ApexChart,
	ApexFill,
	ApexNonAxisChartSeries,
	ApexPlotOptions,
	ApexStroke,
} from 'ng-apexcharts'

export type RadialChartOptions = {
	series: ApexNonAxisChartSeries
	chart: ApexChart
	plotOptions: ApexPlotOptions
	fill: ApexFill
	stroke: ApexStroke
	colors: string[]
}

function getCssVar(name: string): string {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

export function createRadialChartOptions(
	percentage: number,
): Partial<RadialChartOptions> {
	const goalColor = getCssVar('--goal-foreground') || 'oklch(0.6 0.118 184.704)'
	const trackColor = getCssVar('--goal') || 'oklch(0.967 0.001 286.375)'
	const valueColor = getCssVar('--goal-foreground') || 'oklch(0.967 0.001 286.375)'

	return {
		series: [percentage],
		chart: {
			type: 'radialBar',
			height: 60,
			width: 60,
			sparkline: {
				enabled: true,
			},
		},
		colors: [goalColor],
		plotOptions: {
			radialBar: {
				hollow: {
					size: '50%',
				},
				track: {
					background: trackColor,
				},
				dataLabels: {
					show: true,
					name: {
						show: false,
					},
					value: {
						show: true,
						fontSize: '12px',
						fontWeight: 700,
						color: valueColor,
						offsetY: 4,
						formatter: (val: number) => `${Math.round(val)}%`,
					},
				},
			},
		},
		stroke: {
			lineCap: 'round',
		},
		fill: {
			type: 'solid',
		},
	}
}
