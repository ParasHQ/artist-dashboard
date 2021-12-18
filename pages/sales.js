import axios from 'axios'
import Layout from 'components/Layout'
import Head from 'next/head'
import Sidebar from 'components/Sidebar'
import Logout from 'components/Logout'
import Link from 'next/link'
import BuyerLoader from 'components/BuyerLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useState, useEffect } from 'react'
import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useNearProvider } from 'hooks/useNearProvider'
import Navbar from 'components/Navbar'
import Card from 'components/Card'

const title = 'Paras Analytics'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`

const LIMIT = 10
const HEADERS = [
	{
		id: 'collection_id',
		title: 'Token',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'price',
		title: 'Price',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'from',
		title: 'From',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'to',
		title: 'To',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'time',
		title: 'Time',
		className: `flex flex-col md:flex-row items-center w-2/6 md:w-full md:flex-shrink-0 p-3 md:p-0 lg:p-3 md:h-full`,
	},
]

const Sales = () => {
	const [primarySales, setPrimarySales] = useState([])
	const [secondarySales, setSecondarySales] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [hasMore2, setHasMore2] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isFetching2, setIsFetching2] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showDetailSales, setShowDetailSales] = useState(-1)
	const { isInit } = useNearProvider()

	const router = useRouter()

	useEffect(() => {
		if (isInit) {
			if (router.query.tab === 'secondary') {
				getSecondarySales()
			} else {
				getPrimarySales()
			}
		}
	}, [isInit, router.query.tab])

	const getPrimarySales = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const primary = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artist-primary-sales`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})

		const newPrimary = await primary.data.data
		const newPrimarySales = [...primarySales, ...newPrimary]
		setPrimarySales(newPrimarySales)
		setPage(page + 1)
		if (newPrimary.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const getSecondarySales = async () => {
		if (!hasMore2 || isFetching2) {
			return
		}

		setIsFetching2(true)

		const secondary = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artist-secondary-sales`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})

		const newSecondary = await secondary.data.data
		const newSecondarySales = [...secondarySales, ...newSecondary]
		setSecondarySales(newSecondarySales)
		setPage(page + 1)
		if (newSecondary.length < LIMIT) {
			setHasMore2(false)
		} else {
			setHasMore2(true)
		}
		setIsFetching2(false)
	}

	const changeTab = (tab) => {
		router.push({
			query: {
				...router.query,
				tab: tab,
			},
		})
	}

	const showDetail = (index) => {
		if (showDetailSales == index) setShowDetailSales(-1)
		else setShowDetailSales(index)
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
						<h4 className="text-4xl font-bold">Sales</h4>
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
					<div className="overflow-x-auto bg-black bg-opacity-25 w-full rounded-lg">
						<div className="text-white bg-gray-800 rounded p-3">
							<div className="block md:hidden">
								<div className="grid grid-cols-2 w-full bg-gray-800 shadow-lg mb-2">
									<button
										className={`rounded-tl text-sm md:text-md py-2 ${
											router.query.tab === 'secondary' &&
											'bg-gray-900 bg-opacity-50 text-gray-600 hover:text-gray-500 hover:bg-opacity-60'
										}`}
										onClick={() => changeTab('primary')}
									>
										Primary Sale
									</button>
									<button
										className={`rounded-tr text-sm md:text-md py-2 ${
											router.query.tab !== 'secondary' &&
											'bg-gray-900 bg-opacity-50 text-gray-600 hover:text-gray-500 hover:bg-opacity-60'
										} `}
										onClick={() => changeTab('secondary')}
									>
										Secondary Sale
									</button>
								</div>
							</div>
							<div className="hidden md:block">
								<div className="grid grid-cols-2 w-full bg-gray-800 shadow-lg mb-2">
									<button
										className={`rounded-tl text-sm md:text-md py-2 ${
											router.query.tab === 'secondary' &&
											'bg-gray-900 bg-opacity-50 text-gray-600 hover:text-gray-500 hover:bg-opacity-60'
										}`}
										onClick={() => changeTab('primary')}
									>
										Primary Sale
									</button>
									<button
										className={`rounded-tr text-sm md:text-md py-2 ${
											router.query.tab !== 'secondary' &&
											'bg-gray-900 bg-opacity-50 text-gray-600 hover:text-gray-500 hover:bg-opacity-60'
										} `}
										onClick={() => changeTab('secondary')}
									>
										Secondary Sale
									</button>
								</div>
								<div className="grid grid-cols-6 gap-10 text-gray-300 hover:opacity-75 border-gray-600 border-b-2">
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
								dataLength={
									router.query.tab === 'secondary' ? secondarySales.length : primarySales.length
								}
								next={router.query.tab === 'secondary' ? getSecondarySales : getPrimarySales}
								hasMore={router.query.tab === 'secondary' ? hasMore2 : hasMore}
								loader={<BuyerLoader />}
							>
								{router.query.tab === 'secondary' ? (
									<SaleItem
										data={secondarySales}
										showDetail={showDetail}
										showDetailSales={showDetailSales}
									/>
								) : (
									<SaleItem
										data={primarySales}
										showDetail={showDetail}
										showDetailSales={showDetailSales}
									/>
								)}
							</InfiniteScroll>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Sales

const SaleItem = ({ data, showDetail, showDetailSales }) => {
	return (
		<>
			{data.map((sales, index) => {
				return (
					<div key={sales._id} className="py-3">
						<div className="w-full">
							<div
								className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-6 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800"
								onClick={() => showDetail(index)}
							>
								<div className="flex md:col-span-2 items-center md:cursor-pointer">
									<div className="w-1/4 bg-blue-900 rounded z-20">
										{sales?.token_detail?.metadata?.media && (
											<div>
												<div className="w-full m-auto hidden md:block">
													<Card
														imgUrl={parseImgUrl(sales.token_detail?.metadata.media, null, {
															width: `600`,
															useOriginal: process.env.APP_ENV === 'production' ? false : true,
														})}
														imgBlur={sales.token_detail?.metadata.blurhash}
														flippable={false}
														token={{
															title: sales.token_detail?.metadata.title,
															collection:
																sales.token_detail?.metadata.collection || sales.contract_id,
															copies: sales.token_detail?.metadata.copies,
															creatorId:
																sales.token_detail?.metadata.creator_id || sales.contract_id,
															description: sales.token_detail?.metadata.description,
															royalty: sales.royalty || 0,
															attributes: sales.token_detail?.metadata.attributes,
														}}
													/>
												</div>
												<div className="block md:hidden">
													<img
														src={parseImgUrl(sales?.token_detail?.metadata.media, null, {
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
											href={`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/token/${sales.contract_id}::${sales.token_series_id}`}
										>
											<a className="font-semibold z-20">
												{prettyTruncate(sales?.token_detail?.metadata.title)}
											</a>
										</Link>
										<Link
											href={`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/token/${sales.contract_id}::${sales.token_series_id}`}
										>
											<p className="w-min md:hidden font-semibold truncate z-20">
												{formatNearAmount(sales.price ? sales.price : '0')} Ⓝ
											</p>
										</Link>
									</div>
								</div>
								<div
									className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
								>
									{formatNearAmount(sales.price ? sales.price : '0')} Ⓝ
								</div>
								<div
									className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
								>
									<Link href={`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/${sales.from}`}>
										<a className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
											{sales.from && prettyTruncate(sales.from, 12, 'address')}
										</a>
									</Link>{' '}
								</div>
								<div
									className={`${HEADERS[3].className} hidden md:flex md:text-sm lg:text-base justify-start`}
								>
									<Link href={`${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/${sales.to}`}>
										<a className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
											{sales.to && prettyTruncate(sales.to, 12, 'address')}
										</a>
									</Link>
								</div>
								<div
									className={`${HEADERS[4].className} text-xs text-center sm:text-base md:text-sm text-gray-50 opacity-50 font-thin w-full justify-end`}
								>
									{timeAgo.format(new Date(sales.issued_at ? sales.issued_at : 1636197684986))}
									<div className="relative top-1 items-end md:hidden">
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
						</div>
						{showDetailSales == index && (
							<div
								key={sales._id}
								className="flex order-5 w-full justify-between items-center my-2 py-2 border-t-2 border-b-2 border-opacity-10 text-xs md:hidden"
							>
								<div className="flex flex-col flex-shrink text-center w-1/2">
									<p className="font-thin text-white text-opacity-50 pb-2">From</p>
									<p className="font-bold cursor-pointer">{prettyTruncate(sales.from, 10)}</p>
								</div>
								<div className="flex flex-col flex-shrink text-center w-1/2">
									<p className="font-thin text-white text-opacity-50 pb-2">To</p>
									<p className="font-bold cursor-pointer">{prettyTruncate(sales.to, 10)}</p>
								</div>
								<div className="flex flex-col flex-shrink text-center w-1/2">
									<p className="font-thin text-white text-opacity-50 pb-2">Time</p>
									<p className="font-bold cursor-pointer">
										{timeAgo.format(new Date(sales.issued_at ? sales.issued_at : 1636197684986))}
									</p>
								</div>
							</div>
						)}
					</div>
				)
			})}
		</>
	)
}
