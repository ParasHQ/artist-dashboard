import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { prettyBalance } from 'utils/common'

const TxChart = ({ overviewData }) => {
  const [tooltipTitle, setTooltipTitle] = useState(null)
  const [tooltipPrimary, setTooltipPrimary] = useState(null)
  const [tooltipSecondary, setTooltipSecondary] = useState(null)
  const [tooltipDate, setTooltipDate] = useState(null)

  useEffect(() => {
    if (!tooltipTitle && overviewData.length > 0) {
      calculateTotalVolume()
    }
  }, [tooltipTitle, overviewData])

  const calculateTotalVolume = () => {
    const totalPrimary = overviewData.reduce((a, b) => {
      return a + b.primarySales
    }, 0)
    const totalSecondary = overviewData.reduce((a, b) => {
      return a + b.secondarySales
    }, 0)
    setTooltipTitle(totalPrimary + totalSecondary)
    setTooltipPrimary(totalPrimary)
    setTooltipSecondary(totalSecondary)
  }

  return (
    <div
      className="p-4 rounded-md"
      style={{
        background: `linear-gradient(225deg, rgba(2, 9, 164, 0.2) 0%, rgba(10, 224, 188, 0.2) 100%)`,
      }}
    >
      {tooltipTitle && (
        <div>
          <p className="text-sm uppercase text-gray-300 tracking-wider">
            Transactions
          </p>
          <div className="mt-2 flex items-center">
            <p className="text-3xl font-semibold">
              {prettyBalance(tooltipTitle, 0, 4)} TXs
            </p>
            <div className="text-xs pl-4">
              <div className="text-green-300">
                Primary: {prettyBalance(tooltipPrimary, 0, 4)}
              </div>
              <div className="text-blue-300">
                Secondary: {prettyBalance(tooltipSecondary, 0, 4)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-300">
            {tooltipDate
              ? dayjs(tooltipDate).format('MMM D, YYYY')
              : 'in 30 days'}
          </div>
        </div>
      )}

      {overviewData.length > 0 && (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overviewData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              onMouseLeave={() => {
                calculateTotalVolume()
              }}
            >
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
                  if (name === 'primarySales' && tooltipPrimary != value) {
                    setTooltipTitle(
                      props.payload.primarySales + props.payload.secondarySales
                    )
                    setTooltipPrimary(props.payload.primarySales)
                    setTooltipSecondary(props.payload.secondarySales)
                    setTooltipDate(props.payload.date)
                  }
                }}
              />
              <Bar
                dataKey="primarySales"
                stackId="a"
                className="fill-current text-green-300"
              />
              <Bar
                dataKey="secondarySales"
                stackId="a"
                className="fill-current text-blue-300"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TxChart
