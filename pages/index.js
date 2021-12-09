import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import { OVERVIEW_DATA, BREAKDOWN_DATA, STATS_DATA, TOP_BUYERS, TOP_CARDS } from 'constants/dummy'
import LineChart from 'components/LineChart'

const title = 'Paras Analytics'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`

const Loading = ({ isLoading }) => {
	return (
		<div
			className={`transition-opacity duration-150 fixed inset-0 z-50 bg-gray-900 flex items-center justify-center ${
				isLoading ? `opacity-100` : `opacity-0 z-[-1]`
			}`}
		>
			<div>
				<div className="animate-bounce">
					<svg width="80" viewBox="0 0 600 713" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M95.2381 712.881L0 0L402.381 71.2881C419.486 75.7807 435.323 79.3925 449.906 82.7181C504.744 95.224 541.843 103.684 561.905 139.725C587.302 185.032 600 240.795 600 307.014C600 373.55 587.302 429.471 561.905 474.779C536.508 520.087 483.333 542.74 402.381 542.74H228.095L261.429 712.881H95.2381ZM147.619 147.329L364.777 185.407C374.008 187.807 382.555 189.736 390.426 191.513C420.02 198.193 440.042 202.712 450.869 221.963C464.575 246.164 471.428 275.95 471.428 311.321C471.428 346.861 464.575 376.731 450.869 400.932C437.163 425.133 408.466 437.234 364.777 437.234H265.578L205.798 432.481L147.619 147.329Z"
							fill="white"
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}

export default function Home() {
	const [overviewData, setOverviewData] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		setOverviewData(OVERVIEW_DATA)
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
			<Loading isLoading={isLoading} />

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
									GM, <span className="font-bold">hendri.near</span>!
								</p>
							</div>
							<div>User/Login</div>
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
										<p>Total Revenue</p>
										<p className="text-3xl font-semibold">20,000 N</p>
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
								{BREAKDOWN_DATA.map((b, idx) => {
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
												<p className="text-lg font-semibold">{b.value}</p>
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
									{STATS_DATA.map((s, idx) => {
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
									{TOP_BUYERS.map((u, idx) => {
										return (
											<div key={idx} className="flex items-center">
												<div className="w-2/3">{u.accountId}</div>
												<div className="w-1/3 text-right">{u.volume}</div>
											</div>
										)
									})}
								</div>
							</div>
							<div className="w-full md:w-1/2 p-4">
								<div>
									<p className="text-2xl font-semibold">Top Cards</p>
									<p className="text-sm opacity-75">Last 30 days</p>
								</div>
								<div className="mt-4">
									{TOP_CARDS.map((u, idx) => {
										return (
											<div key={idx} className="flex items-center">
												<div className="w-2/3">{u.accountId}</div>
												<div className="w-1/3 text-right">{u.volume}</div>
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
