import ContentLoader from 'react-content-loader'

const CardLoader = (props) => (
	<div className="flex flex-col items-center justify-center">
		<ContentLoader
			speed={2}
			viewBox="0 0 1200 300"
			backgroundColor="#1D1D1D"
			foregroundColor="#282828"
			uniqueKey="card-stat-loader"
			{...props}
		>
			<rect x="0" y="50" rx="11" ry="11" width="100" height="100" />
			<rect x="330" y="80" rx="11" ry="11" width="800" height="50" />
			<rect x="0" y="200" rx="11" ry="11" width="100" height="500" />
			<rect x="330" y="280" rx="11" ry="11" width="800" height="50" />
		</ContentLoader>
	</div>
)

export default CardLoader
