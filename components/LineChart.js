import dayjs from 'dayjs'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { toHumanReadable } from 'utils/common'

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900 text-white p-2 rounded-md">
				<div>{dayjs(payload[0].payload.dateTs).format('MMM DD, YYYY')}</div>
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div>
								{p.dataKey} {formatNearAmount(p.payload[p.dataKey], 2)} N
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return null
}

const LineChart = ({ data }) => {
	const [tooltipData, setTooltipData] = useState(null)

	useEffect(() => {
		if (!tooltipData && data.length > 0) {
			calculateTotalVolume()
		}
	}, [tooltipData, data])

	const calculateTotalVolume = () => {
		const totalVolume = data.reduce((a, b) => {
			return a + b.volumeUsd
		}, 0)
		setTooltipData({
			title: totalVolume,
			subtitle: null,
		})
	}

	return (
		<div>
			{data.length > 0 && (
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
							<defs>
								<linearGradient direction={90} id="paint0_linear" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3389ff" stopOpacity={0.5} />
									<stop offset="50%" stopColor="#9030ff" stopOpacity={0.3} />
									<stop offset="75%" stopColor="#FF0000" stopOpacity={0.15} />
									<stop offset="100%" stopColor="#FF0000" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="4 8" horizontal={false} />
							<YAxis
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return toHumanReadable(x / 10 ** 24)
								}}
							/>
							<XAxis
								interval={2}
								dataKey="dateTs"
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return `${new Date(x).getDate()}`
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend
								wrapperStyle={{
									position: 'relative',
								}}
								align="center"
								formatter={(value) => {
									return value[0].toUpperCase() + value.slice(1)
								}}
							/>
							<Area
								type="monotone"
								stackId="1"
								dataKey="volume"
								dot={false}
								stroke="#3389ff"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#paint0_linear)"
							/>
							<Area
								type="monotone"
								stackId="2"
								dataKey="revenue"
								dot={false}
								stroke="#9030ff"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#paint0_linear)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	)
}

export default LineChart
