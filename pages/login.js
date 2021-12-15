import near from 'services/near'

const Login = () => {
	return (
		<div>
			<div>Login</div>
			<button onClick={() => near.login()}>Login</button>
		</div>
	)
}

export default Login
