import near from 'services/near'

const Logout = () => {
	const _signOut = async () => {
		near.logout()
		window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/login`)
	}

	return (
		<button
			onClick={_signOut}
			className="bg-gray-800 text-opacity-5 p-3 rounded-lg text-sm hover:bg-gray-700"
		>
			Logout
		</button>
	)
}

export default Logout
