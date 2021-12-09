import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from 'components/Layout'
import Logo from 'components/Logo'

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
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
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

			<div className="max-w-5xl mx-auto min-h-screen p-4">
				<div className="flex items-center py-4">
					<div className="w-0 md:w-1/3"></div>
					<div className="w-1/2 md:w-1/3">
						<div className="w-24 mx-0 md:mx-auto">
							<Logo />
						</div>
					</div>
					<div className="w-1/2 md:w-1/3 text-right">
						<a className="hover:opacity-75" target="_blank" href="https://paras.id">
							<span>Visit Paras</span>
							<svg
								className="inline-block pl-1 -mt-2"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M5 5V19H19V12H21V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H12V5H5ZM14 5V3H21V10H19V6.41L9.17 16.24L7.76 14.83L17.59 5H14Z"
									fill="white"
								/>
							</svg>
						</a>
					</div>
				</div>
				<div>BODY</div>
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
		</Layout>
	)
}
