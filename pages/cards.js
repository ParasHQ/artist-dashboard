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
import Navbar from 'components/Navbar'
import Card from 'components/Card'

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
	const [showModal, setShowModal] = useState(false)
	const [showDetailActivity, setShowDetailActivity] = useState(-1)
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
		const cards = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artist-top-cards`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT_CARDS,
				__limit: LIMIT_CARDS,
			},
			headers: {
				authorization: await near.authToken(),
			},
		})

		const newCards = await cards.data.data.top_cards
		const newCardsData = [...cardsData, ...newCards]
		setCardsData(newCardsData)
		setPage(page + 1)
		if (newCards.length < LIMIT_CARDS) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const showDetail = (index) => {
		if (showDetailActivity == index) setShowDetailActivity(-1)
		else setShowDetailActivity(index)
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
				<div className="hidden md:block md:relative w-1/4">
					<Sidebar />
				</div>
				<div className="w-full relative md:w-3/4 bg-gray-900 bg-opacity-50 p-6">
					<div className="flex flex-1 items-center justify-between mb-10">
						<h4 className="text-4xl font-bold">Top Cards</h4>
						<div>
							<div className="hidden md:block">
								<Logout />
							</div>
							<div className="block md:hidden">
								<button
									onClick={() => {
										showModal ? setShowModal(false) : setShowModal(true)
									}}
								>
									<svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
										{showModal ? (
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											></path>
										) : (
											<path
												fillRule="evenodd"
												d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
												clipRule="evenodd"
											></path>
										)}
									</svg>
								</button>
							</div>
						</div>
						{showModal && <Navbar />}
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
							{cardsData.map((card, index) => {
								return (
									<div key={card._id} className="py-3">
										<div className="w-full">
											<div
												className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-8 md:gap-3 md:h-19 md:hover:bg-gray-800"
												onClick={() => showDetail(index)}
											>
												<div className="flex md:col-span-2 items-center md:cursor-pointer">
													<div className="w-1/4 bg-blue-900 rounded z-20">
														{card?.token_detail.metadata.media && (
															<div>
																<div className="w-full m-auto hidden md:block">
																	<Card
																		imgUrl={parseImgUrl(card.token_detail.metadata.media, null, {
																			width: `300`,
																			useOriginal:
																				process.env.APP_ENV === 'production' ? false : true,
																		})}
																		imgBlur={card.token_detail.metadata.blurhash}
																		flippable={false}
																		token={{
																			title: card.token_detail.metadata.title,
																			collection:
																				card.token_detail.metadata.collection || card.contract_id,
																			copies: card.token_detail.metadata.copies,
																			creatorId:
																				card.token_detail.metadata.creator_id || card.contract_id,
																			description: card.token_detail.metadata.description,
																			royalty: card.royalty || 0,
																			attributes: card.token_detail.metadata.attributes,
																		}}
																	/>
																</div>
																<div className="block md:hidden">
																	<img
																		src={parseImgUrl(card.token_detail?.metadata.media, null, {
																			width: `200`,
																		})}
																		className="bg-cover"
																	/>
																</div>
															</div>
														)}
													</div>
													<div className="pl-4 cursor-pointer">
														<Link
															href={`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/token/${card.token_detail.contract_id}::${card.token_detail.token_series_id}`}
														>
															<a className="text-xs md:text-lg font-semibold z-20">
																{prettyTruncate(card?.token_detail.metadata.title, 25)}
															</a>
														</Link>
														<p className="w-min md:hidden font-semibold truncate z-20">
															<p className="text-xs">
																Total Sales : {card.total_sales ? card.total_sales : '0'}
															</p>
														</p>
													</div>
												</div>
												<div
													className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
												>
													{card.token_detail.in_circulation || '1'}
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<p className="font-thin">
														{formatNearAmount(card.first_sale ? card.first_sale : '0')} Ⓝ
													</p>
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<p className="font-thin">
														{formatNearAmount(card.last_sale ? card.last_sale : '0')} Ⓝ
													</p>
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<p className="font-thin truncate">
														{formatNearAmount(card.avg_price ? card.avg_price.split('.')[0] : '0')}{' '}
														Ⓝ
													</p>
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<p className="font-thin">{card.total_sales}</p>
												</div>
												<div
													className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
												>
													<p className="font-thin">
														{formatNearAmount(card.volume ? card.volume : '0')} Ⓝ
													</p>
												</div>
												<div className="relative top-1 right-4 flex flex-grow justify-end md:hidden">
													<svg
														width="10"
														height="10"
														viewBox="0 0 21 19"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z"
															fill="white"
														/>
													</svg>
												</div>
											</div>
										</div>
										{showDetailActivity == index && (
											<div
												key={card._id}
												className="flex order-5 w-full justify-between items-center my-2 py-2 border-t-2 border-b-2 border-opacity-10 text-xs md:hidden"
											>
												<div className="flex flex-col flex-shrink text-center w-1/2">
													<p className="font-thin text-white text-opacity-50 pb-2">Supply</p>
													<p className="font-bold cursor-pointer">{card.in_circulation || '1'}</p>
												</div>
												<div className="flex flex-col flex-shrink text-center w-1/2">
													<p className="font-thin text-white text-opacity-50 pb-2">First</p>
													<p className="font-bold cursor-pointer">
														{formatNearAmount(card.first_sale ? card.first_sale : '0')} Ⓝ
													</p>
												</div>
												<div className="flex flex-col flex-shrink text-center w-1/2">
													<p className="font-thin text-white text-opacity-50 pb-2">Last</p>
													<p className="font-bold cursor-pointer">
														{formatNearAmount(card.last_sale ? card.last_sale : '0')} Ⓝ
													</p>
												</div>
												<div className="flex flex-col flex-shrink text-center w-1/2">
													<p className="font-thin text-white text-opacity-50 pb-2">Avg Price</p>
													<p className="font-bold cursor-pointer">
														{prettyTruncate(
															formatNearAmount(card.avg_price ? card.avg_price.split('.')[0] : '0'),
															5
														)}
														Ⓝ{' '}
													</p>
												</div>
												<div className="flex flex-col flex-shrink text-center w-1/2">
													<p className="font-thin text-white text-opacity-50 pb-2">Volume</p>
													<p className="font-bold cursor-pointer">
														{formatNearAmount(card.volume ? card.volume : '0')} Ⓝ
													</p>
												</div>
											</div>
										)}
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
