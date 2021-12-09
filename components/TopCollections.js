import cachios from 'cachios'
import { useEffect, useState } from 'react'
import { parseImgUrl, prettyBalance } from 'utils/common'

const HEADERS = [
	{
		id: 'collection_id',
		title: 'Collection',
		className: `flex w-4/6 lg:w-2/6 flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'volume_usd',
		title: 'Volume',
		className: `flex items-center w-2/6 lg:w-1/6 justify-end flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'avg_price_usd',
		title: 'Avg. Price',
		className: `flex items-center w-2/6 lg:w-1/6 justify-end flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'total_owners',
		title: 'Owners',
		className: `flex items-center w-2/6 lg:w-1/6 justify-end flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'total_cards',
		title: 'Cards',
		className: `flex items-center w-2/6 lg:w-1/6 justify-end flex-shrink-0 p-3 h-full`,
	},
]

const LIMIT = 10

const RowCollection = ({ d }) => {
	const [collection, setCollection] = useState(null)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		try {
			const resp = await cachios.get(`https://api-v2-mainnet.paras.id/collections`, {
				params: {
					collection_id: d.collection_id,
				},
			})
			setCollection(resp.data.data.results[0])
		} catch (err) {
			return
		}
	}

	return (
		<a className="w-full" href={`https://paras.id/collection/${d.collection_id}`} target="_blank">
			<div className="flex items-center h-16 lg:hover:bg-gray-800">
				<div className={`${HEADERS[0].className} flex items-center`}>
					<div className="flex-shrink-0 flex-grow-1 w-8 md:w-10 h-8 md:h-10 bg-blue-900 rounded-full overflow-hidden">
						{collection?.media && <img src={parseImgUrl(collection?.media)} className="bg-cover" />}
					</div>
					<div className="pl-4 overflow-hidden">
						<p className="font-semibold truncate">{collection?.collection}</p>
						<span className="text-sm text-gray-300 truncate">by {collection?.creator_id}</span>
					</div>
				</div>
				<div className={HEADERS[1].className}>${prettyBalance(d.volume_usd, 0, 4)}</div>
				<div className={HEADERS[2].className}>${prettyBalance(d.avg_price_usd, 0, 4)}</div>
				<div className={HEADERS[3].className}>{d.total_owners}</div>
				<div className={HEADERS[4].className}>{d.total_cards}</div>
			</div>
		</a>
	)
}

const TopCollections = ({ data }) => {
	const [localData, setLocalData] = useState(data)
	const [page, setPage] = useState(0)
	const [sortBy, setSortBy] = useState(`volume_usd`)
	const [orderBy, setOrderBy] = useState(`desc`)

	useEffect(() => {
		const currData = [...localData]
		currData.sort((a, b) => {
			if (orderBy === 'desc') {
				return a[sortBy] > b[sortBy] ? -1 : a[sortBy] < b[sortBy] ? 1 : 0
			} else {
				return a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0
			}
		})
		setLocalData(currData)
	}, [sortBy, orderBy])

	return (
		<div>
			<div className="overflow-x-auto bg-black bg-opacity-25 w-full rounded-lg">
				<div>
					<div className="flex text-gray-300 ">
						{HEADERS.map((d) => {
							return (
								<div
									key={d.id}
									className={`${d.className} cursor-pointer hover:opacity-75 border-gray-800 border-b-2`}
									onClick={() => {
										if (sortBy === d.id) {
											if (orderBy === 'desc') {
												setOrderBy('asc')
											} else {
												setOrderBy('desc')
											}
										} else {
											setSortBy(d.id)
											setOrderBy('desc')
										}
									}}
								>
									<span>{d.title}</span>
									{sortBy === d.id ? (
										<span className="inline-block pl-2">{orderBy === 'desc' ? '↓' : '↑'}</span>
									) : null}
								</div>
							)
						})}
					</div>
				</div>
				{localData.slice(page * LIMIT, (page + 1) * LIMIT).map((d) => {
					return (
						<div key={d.collection_id}>
							<RowCollection d={d} />
						</div>
					)
				})}
			</div>
			<div className="mt-4 flex items-center justify-center">
				<button
					className="disabled:opacity-75"
					disabled={page === 0}
					onClick={() => {
						setPage(page - 1)
					}}
				>
					Prev
				</button>
				<div className="px-8">
					{page + 1} / {Math.ceil(localData.length / LIMIT)}
				</div>
				<button
					className="disabled:opacity-75"
					disabled={page + 1 === Math.ceil(localData.length / LIMIT)}
					onClick={() => {
						setPage(page + 1)
					}}
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default TopCollections
