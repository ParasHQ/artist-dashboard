import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { prettyBalance } from 'utils/common'

const Chart = ({ overviewData }) => {
	const [tooltipData, setTooltipData] = useState(null)

	useEffect(() => {
		if (!tooltipData && overviewData.length > 0) {
			calculateTotalVolume()
		}
	}, [tooltipData, overviewData])

	const calculateTotalVolume = () => {
		const totalVolume = overviewData.reduce((a, b) => {
			return a + b.volumeUsd
		}, 0)
		setTooltipData({
			title: totalVolume,
			subtitle: null,
		})
	}

	return (
		<div
			className="p-4 rounded-md"
			style={{
				background: `linear-gradient(225deg, rgba(2, 9, 164, 0.2) 0%, rgba(10, 224, 188, 0.2) 100%)`,
			}}
		>
			{tooltipData && (
				<div>
					<p className="text-sm uppercase text-gray-300 tracking-wider">Volume</p>
					<p className="mt-2 text-3xl font-semibold">
						{prettyBalance(tooltipData.title, 0, 4)} USD
					</p>
					<p className="text-xs text-gray-300">
						{tooltipData.subtitle
							? dayjs(tooltipData.subtitle).format('MMM D, YYYY')
							: 'in 30 days'}
					</p>
				</div>
			)}

			{overviewData.length > 0 && (
				<div className="h-60">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={overviewData}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
							onMouseLeave={() => {
								calculateTotalVolume()
							}}
						>
							<defs>
								<linearGradient id="paint0_linear" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#06FFFF" stopOpacity={0.5} />
									<stop offset="90%" stopColor="#06FFFF" stopOpacity={0} />
								</linearGradient>
							</defs>

							<XAxis
								interval={3}
								dataKey="dateTs"
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return `${new Date(x).getDate()}`
								}}
							/>
							<Tooltip
								contentStyle={{ display: 'none' }}
								formatter={(value, name, props) => {
									if (tooltipData && tooltipData.title != value) {
										setTooltipData({
											title: value,
											subtitle: props.payload.date,
										})
									}
								}}
							/>
							<Area
								type="monotone"
								dataKey="volumeUsd"
								dot={false}
								stroke="#06FFFF"
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

export default Chart
