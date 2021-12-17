import axios from 'axios'
import Layout from 'components/Layout'
import Head from 'next/head'
import Sidebar from 'components/Sidebar'
import Logout from 'components/Logout'
import Link from 'next/link'
import BuyerLoader from 'components/BuyerLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import near from 'services/near'
import React, { useState, useEffect } from 'react'
import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useNearProvider } from 'hooks/useNearProvider'

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
	const [isFetching, setIsFetching] = useState(false)
	const { isInit } = useNearProvider()

	const router = useRouter()

	useEffect(() => {
		if (isInit) {
			console.log(isInit)
			if (router.query.tab === 'secondary') {
				console.log('Second')
				getSecondarySales()
			} else {
				console.log('Primary')
				getPrimarySales()
			}
		}
	}, [isInit, router.query.tab])

	const getPrimarySales = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const primary = await axios.get(`https://api-v2-testnet.paras.id/artist-primary-sales`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})

		const newPrimary = await primary.data.data
		setPrimarySales(newPrimary)
		setPage(page + 1)
		if (newPrimary.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const getSecondarySales = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)

		const secondary = await axios.get(`https://api-v2-testnet.paras.id/artist-secondary-sales`, {
			params: {
				account_id: 'misfits.tenk.near',
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})

		if (!hasMore || isFetching) {
			return
		}

		const newSecondary = await secondary.data.data
		setSecondarySales(newSecondary)
		setPage(page + 1)
		if (newSecondary.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const changeTab = (tab) => {
		router.push({
			query: {
				...router.query,
				tab: tab,
			},
		})
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
						<h4 className="text-4xl font-bold">Sales</h4>
						<Logout />
					</div>
					<div className="overflow-x-auto bg-black bg-opacity-25 w-full rounded-lg">
						<div className="text-white bg-gray-800 rounded p-3">
							<div className="hidden md:block">
								<div className="grid grid-cols-2 w-full bg-gray-800 shadow-lg mb-2">
									<button
										className={`rounded-tl py-2 ${
											router.query.tab === 'secondary' &&
											'bg-gray-900 bg-opacity-50 text-gray-600 hover:text-gray-500 hover:bg-opacity-60'
										}`}
										onClick={() => changeTab('primary')}
									>
										Primary Sale
									</button>
									<button
										className={`rounded-tr py-2 ${
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
								next={router.query.tab === 'secondary' ? secondarySales : primarySales}
								hasMore={hasMore}
								loader={<BuyerLoader />}
							>
								{router.query.tab === 'secondary' ? (
									<SaleItem data={secondarySales} />
								) : (
									<SaleItem data={primarySales} />
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

const SaleItem = ({ data }) => {
	return (
		<>
			{data.map((sales) => {
				return (
					<div key={sales._id} className="py-3">
						<div className="w-full">
							<div className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-6 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800">
								<div className="flex md:col-span-2 items-center md:cursor-pointer">
									<div className="w-1/4 bg-blue-900 rounded z-20">
										{sales.token_detail?.metadata?.media && (
											<Link href={`/token/${sales.contract_id}::${sales.token_series_id}`}>
												<a>
													<img
														src={parseImgUrl(sales.token_detail.metadata.media, null, {
															width: `200`,
														})}
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
									className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
								>
									{formatNearAmount(sales.price ? sales.price : '0')} Ⓝ
								</div>
								<div
									className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
								>
									<Link href={`/${sales.from}`}>
										<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
											{sales.from && prettyTruncate(sales.from, 12, 'address')}
										</p>
									</Link>{' '}
								</div>
								<div
									className={`${HEADERS[3].className} hidden md:flex md:text-sm lg:text-base justify-start`}
								>
									<Link href={`/${sales.to}`}>
										<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
											{sales.to && prettyTruncate(sales.to, 12, 'address')}
										</p>
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
					</div>
				)
			})}
		</>
	)
}
