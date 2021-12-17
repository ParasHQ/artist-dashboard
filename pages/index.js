import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import LineChart from 'components/LineChart'
import axios from 'axios'
import near from 'services/near'
import { useNearProvider } from 'hooks/useNearProvider'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import cachios from 'cachios'
import Media from 'components/Media'
import { parseImgUrl } from 'utils/common'
import Logout from 'components/Logout'

const title = 'Paras Analytics'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`

const TopBuyer = ({ data }) => {
	const [userData, setUserData] = useState({})
	useEffect(() => {
		const getData = async () => {
			const resp = await cachios.get(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
				params: { accountId: data.account_id },
			})
			setUserData(resp.data.data.results[0])
		}
		if (data.account_id) {
			getData()
		}
	}, [data])

	return (
		<div className="flex items-center mt-2">
			<div className="w-8 h-8 rounded-full overflow-hidden bg-blue-900 border-gray-800 border">
				<Media url={parseImgUrl(userData.imgUrl)} />
			</div>
			<div className="pl-2 flex-grow flex items-center">
				<div className="w-2/3">{data.account_id}</div>
				<div className="w-1/3 text-right">{formatNearAmount(data.volume, 2)} Ⓝ</div>
			</div>
		</div>
	)
}

export default function Home() {
	const [statsData, setStatsData] = useState({})
	const [topBuyers, setTopBuyers] = useState([])
	const [topCards, setTopCards] = useState([])
	const [overviewData, setOverviewData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { isInit } = useNearProvider()

	useEffect(() => {
		if (isInit) {
			fetchData()
		}
	}, [isInit])

	const fetchData = async () => {
		try {
			const resp = await axios.get(`${process.env.V2_API_URL}/artist-stats`, {
				params: {
					account_id: 'testingdo.testnet',
				},
				headers: {
					authorization: await near.authToken(),
				},
			})
			const chartData = resp.data.data.primary_sales.map((d, idx) => {
				const volume = JSBI.add(
					JSBI.BigInt(d.total_volume),
					JSBI.BigInt(resp.data.data.secondary_sales[idx].total_volume)
				)
				const revenue = JSBI.add(
					JSBI.BigInt(d.net_volume),
					JSBI.BigInt(resp.data.data.secondary_sales[idx].net_volume)
				)
				return {
					dateTs: d.date,
					volume: volume.toString(),
					revenue: revenue.toString(),
					primaryVolume: formatNearAmount(d.total_volume),
					primaryNet: formatNearAmount(d.net_volume),
					primarySales: d.total_sales,
					secondaryVolume: formatNearAmount(resp.data.data.secondary_sales[idx].total_volume),
					secondaryNet: formatNearAmount(resp.data.data.secondary_sales[idx].net_volume),
					secondarySales: resp.data.data.secondary_sales[idx].total_sales,
				}
			})
			setOverviewData(chartData)
			const buyersResp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artist-top-buyers`, {
				params: {
					account_id: 'testingdo.testnet',
				},
				headers: {
					authorization: await near.authToken(),
				},
			})
			const cardsResp = await axios.get(`${process.env.V2_API_URL}/artist-top-cards`, {
				params: {
					account_id: 'misfits.tenk.near',
					__skip: 0,
					__limit: 5,
				},
				headers: {
					authorization: await near.authToken(),
				},
			})
			// console.log(resp.data.data)
			// console.log(buyersResp.data.data)
			// console.log(cardsResp.data.data)
			setStatsData({
				total_volume: resp.data.data.total_volume,
				total_revenue: resp.data.data.total_net,
				breakdown: [
					{
						title: 'Primary Sales',
						value: resp.data.data.primary_volume,
						value2: resp.data.data.primary_net,
					},
					{
						title: 'Secondary Sales',
						value: resp.data.data.secondary_volume,
						value2: resp.data.data.secondary_net,
					},
				],
				overview: [
					{
						title: 'Total minted',
						value: resp.data.data.total_minted,
					},
					{
						title: 'Total series',
						value: resp.data.data.total_series,
					},
					{
						title: 'Total buyers',
						value: buyersResp.data.data.total_buyers,
					},
				],
			})
			setTopBuyers(buyersResp.data.data.top_buyers)
			setTopCards(cardsResp.data.data.top_cards)
		} catch (err) {
			console.log(err)
		}
		setIsLoading(false)
	}

	return (
		<Layout>
			<Head>
				<title>{title}</title>
				<meta name="title" content={title} />
				<meta name="description" content={description} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={image} />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:title" content={title} />
				<meta property="twitter:description" content={description} />
				<meta property="twitter:image" content={image} />
			</Head>

			<div className="flex mx-auto min-h-screen">
				<div
					className="fixed inset-0 opacity-75 z-0"
					style={{
						zIndex: 0,
						backgroundImage: `url('/bg.jpg')`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
					}}
				></div>
				<div className="relative w-1/4">
					<Sidebar />
				</div>
				<div className="relative w-3/4 bg-gray-900 bg-opacity-50 p-6">
					<div className="max-w-7xl mr-auto">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-4xl">
									GM, <span className="font-bold">{near.currentUser?.accountId}</span>!
								</p>
							</div>
							<Logout />
						</div>
						<div className="flex flex-wrap">
							<div className="w-full md:w-1/4 mt-6">
								<div>
									<p className="text-2xl font-semibold">Revenue</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								<div
									className="flex items-center rounded-lg p-4 mt-8"
									style={{
										backgroundColor: `#3389ff`,
										backgroundImage: `linear-gradient(135deg, #3389ff 0%, #9030ff 30%, #FF0000 100%)`,
									}}
								>
									<div className="w-12">
										<svg
											width="100%"
											height="100%"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7H15ZM9 15V9H15V15H9Z"
												fill="white"
											/>
										</svg>
									</div>
									<div className="pl-4">
										<p>Total Volume</p>
										<p className="text-3xl font-semibold">
											{formatNearAmount(statsData.total_volume, 2)} Ⓝ
										</p>
									</div>
								</div>
								<div
									className="flex items-center rounded-lg p-4 mt-8"
									style={{
										backgroundColor: `#3389ff`,
										backgroundImage: `linear-gradient(135deg, #3389ff 0%, #9030ff 30%, #FF0000 100%)`,
									}}
								>
									<div className="w-12">
										<svg
											width="100%"
											height="100%"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7H15ZM9 15V9H15V15H9Z"
												fill="white"
											/>
										</svg>
									</div>
									<div className="pl-4">
										<p>Total Revenue</p>
										<p className="text-3xl font-semibold">
											{formatNearAmount(statsData.total_revenue, 2)} Ⓝ
										</p>
									</div>
								</div>
							</div>
							<div className="w-full md:w-3/4 mt-6">
								<div>
									<LineChart data={overviewData} />
								</div>
							</div>
						</div>
						<div className="flex flex-wrap">
							<div className="w-full md:w-1/4 mt-6">
								<div>
									<p className="text-2xl font-semibold">Breakdown</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								{statsData.breakdown?.map((b, idx) => {
									return (
										<div
											key={idx}
											className="flex items-center rounded-lg p-2 mt-8 border-2 border-gray-600"
										>
											<div className="w-12">
												<svg
													width="100%"
													height="100%"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7H15ZM9 15V9H15V15H9Z"
														fill="white"
													/>
												</svg>
											</div>
											<div className="pl-4">
												<p>{b.title}</p>
												<p className="text-lg font-semibold">
													<span className="text-base">Volume:</span> {formatNearAmount(b.value, 2)}{' '}
													Ⓝ
												</p>
												<p className="text-lg font-semibold">
													<span className="text-base">Revenue:</span>{' '}
													{formatNearAmount(b.value2, 2)} Ⓝ
												</p>
											</div>
										</div>
									)
								})}
							</div>
							<div className="w-full md:w-3/4 mt-6 px-8">
								<div>
									<p className="text-2xl font-semibold">Statistics</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								<div className="flex flex-wrap -mx-4 mt-4">
									{statsData.overview?.map((s, idx) => {
										return (
											<div key={idx} className="w-full md:w-1/3 p-4">
												<div className="bg-gray-800 p-4 rounded-lg">
													<p className="text-2xl font-semibold">{s.value}</p>
													<p className="mt-2">{s.title}</p>
													<div className="mt-2 text-sm flex items-center">
														<div className="w-3">
															{s.changes > 0 ? (
																<svg
																	width="100%"
																	height="100%"
																	viewBox="0 0 19 12"
																	fill="current"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M18 1L10.6591 8.91667L6.79545 4.75L1 11M18 1H13M18 1V6"
																		stroke="rgb(52, 211, 153)"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															) : (
																<svg
																	width="100%"
																	height="100%"
																	viewBox="0 0 19 12"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M18 11L10.6591 3.08333L6.79545 7.25L1 1M18 11H13M18 11V6"
																		stroke="rgb(248, 113, 113)"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															)}
														</div>
														<p
															className={`${
																s.changes > 0 ? 'text-green-400' : 'text-red-400'
															} pl-1 font-semibold`}
														>
															{s.changes}%
														</p>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
						<div className="flex flex-wrap mt-8 -mx-4">
							<div className="w-full md:w-1/2 p-4">
								<div>
									<p className="text-2xl font-semibold">Top Buyers</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								<div className="mt-4">
									{topBuyers.map((u, idx) => {
										return <TopBuyer key={idx} data={u} />
									})}
								</div>
							</div>
							<div className="w-full md:w-1/2 p-4">
								<div>
									<p className="text-2xl font-semibold">Top Cards</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								<div className="mt-4">
									{topCards.map((u, idx) => {
										return (
											<div key={idx} className="flex items-center">
												<div className="w-2/3">{u.token_detail.metadata.title}</div>
												<div className="w-1/3 text-right">{formatNearAmount(u.volume)} Ⓝ</div>
											</div>
										)
									})}
								</div>
							</div>
						</div>
						<div className="mt-16 mb-2 flex flex-wrap justify-between">
							<div className="-mx-2 flex items-center flex-wrap text-gray-300">
								<div className="px-2">
									<a className="hover:text-white" href="https://paras.id" target="_blank">
										Marketplace
									</a>
								</div>
								<div className="px-2">
									<a className="hover:text-white" href="https://team.paras.id" target="_blank">
										About
									</a>
								</div>
							</div>
							<div>
								<div>(c) Paras 2021</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
