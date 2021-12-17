import 'tailwindcss/tailwind.css'
import 'styles/global.css'
import { NearProvider } from 'hooks/useNearProvider'
import near from 'services/near'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		if (near.currentUser === undefined) {
			window.location.replace(`${process.env.BASE_URL}/login`)
		}
	})

	return (
		<NearProvider>
			<Component {...pageProps} />
		</NearProvider>
	)
}

export default MyApp
