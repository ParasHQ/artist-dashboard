import React from 'react'
import Head from 'next/head'
import near from 'services/near'

export default function Login() {
	const login = () => {
		near.login()
	}

	return (
		<div className="min-h-screen relative bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>Login Paras Artists</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta property="og:site_name" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<div className="relative min-h-screen flex flex-col justify-between px-4 pb-24">
				<div className="max-w-lg m-auto pt-16">
					<div className="w-full">
						<div className="flex items-center">
							<div>
								<div>
									<h3 className="text-4xl text-gray-100 font-bold">Paras Dashboard </h3>
									<h3 className="text-xl text-gray-300 font-semibold">For Artists</h3>
								</div>
							</div>
						</div>
						<div className="mt-4">
							<button
								onClick={() => login()}
								className="outline-none h-12 w-full mt-4 rounded-md bg-transparent font-semibold px-4 py-2 bg-primary text-gray-100 "
							>
								Login With NEAR
							</button>
						</div>
					</div>
				</div>
				<div className="mt-auto"></div>
			</div>
		</div>
	)
}
