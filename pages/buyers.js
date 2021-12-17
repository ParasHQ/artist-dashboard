import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import React, { useState, useEffect } from 'react'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import near from 'services/near'
import InfiniteScroll from 'react-infinite-scroll-component'
import BuyerLoader from 'components/BuyerLoader'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Logout from 'components/Logout'
import { useNearProvider } from 'hooks/useNearProvider'

const LIMIT = 30
const title = 'Paras Analytics - Top Buyers'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`
const HEADERS = [
	{
		id: 'buyer',
		title: 'Buyer',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'volume',
		title: 'Volume',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'count',
		title: 'Count',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
]

const CardStats = () => {
	const [buyersData, setBuyersData] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const { isInit } = useNearProvider()

	useEffect(() => {
		if (isInit) getBuyers()
	}, [isInit])

	const getBuyers = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const buyers = await axios.get(`https://api-v2-testnet.paras.id/artist-top-buyers`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
			headers: {
				authorization: await near.authToken(),
			},
		})

		const newBuyers = await buyers.data.data.top_buyers
		setBuyersData(newBuyers)
		setPage(page + 1)
		if (newBuyers.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
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
			<div className="flex w-full mx-auto min-h-screen">
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
					<div className="flex flex-1 items-center justify-between mb-10">
						<h4 className="text-4xl font-bold">Buyers</h4>
						<Logout />
					</div>
					<div className="overflow-x-auto bg-black bg-opacity-25 w-full rounded-lg">
						<div className="text-white bg-gray-800 rounded p-3">
							<div className="hidden md:block">
								<div className="grid grid-cols-4 text-gray-300 hover:opacity-75 border-gray-600 border-b-2">
									{HEADERS.map((d, index) => {
										return (
											<div
												key={d.id}
												className={`${
													index === 0 && 'col-span-2 justify-start'
												} flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`}
											>
												<span>{d.title}</span>
											</div>
										)
									})}
								</div>
							</div>
							<InfiniteScroll
								dataLength={buyersData.length}
								next={getBuyers}
								hasMore={hasMore}
								loader={<BuyerLoader />}
								className="mt-4"
							>
								{buyersData.map((sales) => {
									return (
										<div key={sales._id} className="py-3">
											<div className="w-full">
												<div className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-7 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800">
													<div className="flex md:col-span-2 items-center md:cursor-pointer">
														<div className="w-1/4 bg-blue-900 rounded z-20">
															{sales?.data?.[0]?.metadata.media && (
																<Link
																	href={`/token/${sales.contract_id}::${sales.token_series_id}`}
																>
																	<a>
																		<img
																			src={parseImgUrl(
																				'bafybeigw7wnybdu5f4zus5srgodbae5tjkxtvhp4mnpz6mlbemm5txphvu',
																				null,
																				{
																					width: `200`,
																				}
																			)}
																			className="bg-cover"
																		/>
																	</a>
																</Link>
															)}
														</div>
														<div className="pl-4 overflow-hidden cursor-pointer">
															<Link href={`/token/${sales.contract_id}::${sales.token_series_id}`}>
																<a className="font-semibold z-20">
																	{prettyTruncate(sales?.data?.[0]?.metadata.title, 25)}
																</a>
															</Link>
															<Link href={`/token/${sales.contract_id}::${sales.token_series_id}`}>
																<p className="w-min md:hidden font-semibold truncate z-20">
																	{formatNearAmount(sales.price ? sales.price : '0')} Ⓝ
																</p>
															</Link>
														</div>
													</div>
													<div
														className={`${HEADERS[0].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
													>
														{formatNearAmount(sales.price ? sales.price : '0')} Ⓝ
													</div>
													<div
														className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base justify-start`}
													>
														<Link href={`/${sales.from}`}>
															<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
																{sales.from && prettyTruncate(sales.from, 12, 'address')}
															</p>
														</Link>{' '}
													</div>
													<div
														className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
													>
														<Link href={`/${sales.to}`}>
															<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
																{sales.to && prettyTruncate(sales.to, 12, 'address')}
															</p>
														</Link>
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</InfiniteScroll>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default CardStats
