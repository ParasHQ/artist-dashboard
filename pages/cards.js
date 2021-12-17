import axios from 'axios'
import Layout from 'components/Layout'
import Head from 'next/head'
import Sidebar from 'components/Sidebar'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Logout from 'components/Logout'
import React, { useState, useEffect } from 'react'
import near from 'services/near'
import CardLoader from 'components/CardLoader'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useNearProvider } from 'hooks/useNearProvider'

const LIMIT_CARDS = 30
const title = 'Paras Analytics'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`
const HEADERS = [
	{
		id: 'card',
		title: 'Card',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'supply',
		title: 'Supply',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'firstSale',
		title: 'First Sale',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'lastSale',
		title: 'Last Sale',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'avgSale',
		title: 'Avg. Sale',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'totalSale',
		title: 'Total Sale',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'totalVolume',
		title: 'Total Volume',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
]

const CardStats = () => {
	const [cardsData, setCardsData] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const { isInit } = useNearProvider()

	useEffect(() => {
		if (isInit) {
			getCards()
		}
	}, [isInit])

	const getCards = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const cards = await axios.get(`${process.env.V2_API_URL}/artist-top-cards`, {
			params: {
				account_id: await near.currentUser?.accountId,
				__skip: page * LIMIT_CARDS,
				__limit: LIMIT_CARDS,
			},
			headers: {
				authorization: await near.authToken(),
			},
		})

		const newCards = await cards.data.data.top_cards
		setCardsData(newCards)
		setPage(page + 1)
		if (newCards.length < LIMIT_CARDS) {
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
						<h4 className="text-4xl font-bold">Top Cards</h4>
						<Logout />
					</div>
					<div className="text-white bg-gray-800 rounded p-3">
						<div className="hidden md:block">
							<div className="grid grid-cols-8 gap-3 text-gray-300 hover:opacity-75 border-gray-600 border-b-2">
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
							dataLength={cardsData.length}
							next={getCards}
							hasMore={hasMore}
							loader={<CardLoader />}
							className="mt-4"
						>
							{cardsData.map((card) => {
								return (
									<div key={card._id} className="py-3">
										<div className="w-full">
											<div className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-7 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800">
												<div className="flex md:col-span-2 items-center md:cursor-pointer">
													<div className="w-1/4 bg-blue-900 rounded z-20">
														{card?.data?.[0]?.metadata.media && (
															<Link href={`/token/${card.contract_id}::${card.token_series_id}`}>
																<a>
																	<img
																		src={parseImgUrl(card.media, null, {
																			width: `200`,
																		})}
																		className="bg-cover"
																	/>
																</a>
															</Link>
														)}
													</div>
													<div className="pl-4 overflow-hidden cursor-pointer">
														<Link href={`/token/${card.contract_id}::${card.token_series_id}`}>
															<a className="font-semibold z-20">
																{prettyTruncate(card?.data?.[0]?.metadata.title, 25)}
															</a>
														</Link>
														<Link href={`/token/${card.contract_id}::${card.token_series_id}`}>
															<p className="w-min md:hidden font-semibold truncate z-20">
																{formatNearAmount(card.price ? card.price : '0')} Ⓝ
															</p>
														</Link>
													</div>
												</div>
												<div
													className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
												>
													{formatNearAmount(card.price ? card.price : '0')} Ⓝ
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<Link href={`/${card.from}`}>
														<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
															{card.from && prettyTruncate(card.from, 12, 'address')}
														</p>
													</Link>{' '}
												</div>
												<div
													className={`${HEADERS[3].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<Link href={`/${card.to}`}>
														<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
															{card.to && prettyTruncate(card.to, 12, 'address')}
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
		</Layout>
	)
}

export default CardStats
