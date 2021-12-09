import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { prettyBalance, toHumanReadable } from 'utils/common'

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900 text-white p-2 rounded-md">
				<div>{dayjs(payload[0].payload.dateTs).format('MMM DD, YYYY')}</div>
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div>{prettyBalance(p.payload[p.dataKey], 0, 4)} N</div>
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
				<div className="h-60">
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
									return toHumanReadable(x)
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
							<Area
								type="monotone"
								dataKey="volumeUsd"
								dot={false}
								stroke="#3389ff"
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
