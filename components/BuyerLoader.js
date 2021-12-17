import ContentLoader from 'react-content-loader'

const BuyerLoader = (props) => (
	<ContentLoader
		speed={2}
		viewBox="0 0 1500 100"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="card-stat-loader"
		{...props}
	>
		<rect x="100" y="0" rx="8" ry="8" width="80" height="100" />
		<rect x="250" y="30" rx="8" ry="8" width="200" height="30" />
	</ContentLoader>
)

export default BuyerLoader
