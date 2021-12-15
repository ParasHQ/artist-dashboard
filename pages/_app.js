import 'tailwindcss/tailwind.css'
import 'styles/global.css'
import { NearProvider } from 'hooks/useNearProvider'

function MyApp({ Component, pageProps }) {
	return (
		<NearProvider>
			<Component {...pageProps} />
		</NearProvider>
	)
}

export default MyApp
