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
			<rect x="50" y="0" rx="11" ry="11" width="200" height="150" />
			<rect x="330" y="50" rx="11" ry="11" width="800" height="50" />
			<rect x="50" y="200" rx="11" ry="11" width="200" height="150" />
			<rect x="330" y="250" rx="11" ry="11" width="800" height="50" />
		</ContentLoader>
	</div>
)

export default CardLoader
