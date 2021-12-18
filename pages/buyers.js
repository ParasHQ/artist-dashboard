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
import Navbar from 'components/Navbar'
import cachios from 'cachios'
import Media from 'components/Media'

const LIMIT = 30
const title = 'Paras Analytics - Top Buyers'
const description =
	'Check out the volume and transactions from Paras, a digital collectible marketplace that supports and develops crypto-native IPs.'
const image = `https://paras-media.s3.ap-southeast-1.amazonaws.com/paras-analytics-thumbnail.jpg`
const HEADERS = [
	{
		id: 'buyer',
		title: 'Buyer',
		className: `flex w-4/6 lg:w-full flex-shrink-1 p-3 h-full`,
	},
	{
		id: 'volume',
		title: 'Volume',
		className: `flex items-start md:items-center w-2/6 lg:w-full flex-shrink-1 p-2 h-full`,
	},
	{
		id: 'transaction',
		title: 'Transaction',
		className: `flex items-start md:items-center w-2/6 lg:w-1/3 flex-shrink-1 p-2 h-full`,
	},
]

const Buyers = ({ data, key }) => {
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
		<div key={key} className="py-3">
			<div className="w-full">
				<div className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-4 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800">
					<div
						className={`${HEADERS[0].className} block col-span-2 md:flex md:text-sm lg:text-base font-bold justify-start`}
					>
						<Link href={`${process.env.MARKETPLACE_URL}/${data.account_id}`}>
							<div className="flex items-center">
								<div className="w-8 h-8 rounded-full overflow-hidden bg-blue-900 border-gray-800 border">
									<Media url={parseImgUrl(userData?.imgUrl)} />
								</div>
								<a className="font-semibold pl-2 z-20">
									<p className="block md:hidden font-semibold z-20">
										{prettyTruncate(data.account_id, 8, 'address')}
									</p>
									<p className="hidden md:block font-semibold z-20">
										{prettyTruncate(data.account_id, 20, 'address')}
									</p>
								</a>
							</div>
						</Link>
					</div>
					<div
						className={`${HEADERS[0].className} block md:flex md:text-sm lg:text-base font-bold justify-start`}
					>
						{formatNearAmount(data.volume ? data.volume : '0')} Ⓝ
					</div>
					<div
						className={`${HEADERS[0].className} block md:flex md:text-sm lg:text-base font-bold justify-start`}
					>
						{data.count} Tx
					</div>
				</div>
			</div>
		</div>
	)
}

const CardStats = () => {
	const [buyersData, setBuyersData] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const { isInit } = useNearProvider()

	useEffect(() => {
		if (isInit) getBuyers()
	}, [isInit])

	const getBuyers = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const buyers = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artist-top-buyers`, {
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
				<div className="hidden md:block md:relative w-1/4">
					<Sidebar />
				</div>
				<div className="w-full relative md:w-3/4 bg-gray-900 bg-opacity-50 p-6">
					<div className="flex flex-1 items-center justify-between mb-10">
						<h4 className="text-4xl font-bold">Buyers</h4>
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
							<div className="block">
								<div className="grid grid-cols-4 text-gray-300 hover:opacity-75 border-gray-600 border-b-2">
									{HEADERS.map((d, index) => {
										return (
											<div
												key={d.id}
												className={`${
													index === 0 && 'col-span-2 justify-start'
												} flex items-center w-2/6 lg:w-full flex-shrink-0 py-3 md:p-3 h-full`}
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
								{buyersData.map((buyer, idx) => {
									return <Buyers key={idx} data={buyer} />
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
