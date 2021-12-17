import { useRouter } from 'next/dist/client/router'
import Logo from './Logo'
import Link from 'next/link'

const Navbar = ({ setIsOpen }) => {
	const router = useRouter()

	return (
		<div className="absolute z-30 w-full top-12">
			<div className=" w-full bg-black top-10 rounded">
				<Link href="/">
					<a className=" p-4 flex items-center justify-center">
						<div>
							<svg
								width="17"
								height="17"
								viewBox="0 0 17 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M13.4999 1C14.8807 1 15.9999 2.11929 15.9999 3.5C15.9999 4.88071 14.8807 6 13.4999 6C12.1192 6 10.9999 4.88071 10.9999 3.5C10.9999 2.11929 12.1192 1 13.4999 1Z"
									fill="white"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M13.4999 11C14.8807 11 15.9999 12.1193 15.9999 13.5C15.9999 14.8807 14.8807 16 13.4999 16C12.1192 16 10.9999 14.8807 10.9999 13.5C10.9999 12.1193 12.1192 11 13.4999 11Z"
									fill="white"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M3.49994 1C4.88065 1 5.99994 2.11929 5.99994 3.5C5.99994 4.88071 4.88065 6 3.49994 6C2.11923 6 0.999939 4.88071 0.999939 3.5C0.999939 2.11929 2.11923 1 3.49994 1Z"
									fill="white"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M3.49994 11C4.88065 11 5.99994 12.1193 5.99994 13.5C5.99994 14.8807 4.88065 16 3.49994 16C2.11923 16 0.999939 14.8807 0.999939 13.5C0.999939 12.1193 2.11923 11 3.49994 11Z"
									fill="white"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<div className="pl-4 text-lg">Dashboard</div>
					</a>
				</Link>
				<Link href="/sales">
					<a className="p-4 flex items-center justify-center">
						<div>
							<svg
								width="17"
								height="17"
								viewBox="0 0 17 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M2.67465 3.50008H15.9999L14.9396 9.47901C14.869 9.87691 14.5232 10.1668 14.119 10.1668H3.5007C3.07333 10.1668 2.7211 9.84514 2.67296 9.43068L2.66736 9.33246V9.33246L2.67465 3.50008Z"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M1 1H2.6584L2.66669 4.33338"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M10.5834 14.3335C10.5834 13.4131 11.3296 12.6669 12.25 12.6669C13.1705 12.6669 13.9167 13.4131 13.9167 14.3335C13.9167 15.254 13.1705 16.0002 12.25 16.0002C11.3578 16.0002 10.6273 15.2149 10.5834 14.3335Z"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M4.74991 16.0002C3.82944 16.0002 3.08325 15.254 3.08325 14.3335C3.08325 13.4131 3.82944 12.6669 4.74991 12.6669C5.67038 12.6669 6.41657 13.4131 6.41657 14.3335C6.41657 15.254 5.67038 16.0002 4.74991 16.0002Z"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4.75029 10.1668V12.6668"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M10.1667 14.3335H6.83331"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<div className="pl-4 text-lg">Sales</div>
					</a>
				</Link>
				<Link href="/buyers">
					<a className="p-4 flex items-center justify-center">
						<div>
							<svg
								width="17"
								height="17"
								viewBox="0 0 17 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.49998 9.33333C6.19879 9.33333 4.33331 7.46785 4.33331 5.16667C4.33331 2.86548 6.19879 1 8.49998 1C10.8012 1 12.6666 2.86548 12.6666 5.16667C12.6666 7.46785 10.8012 9.33333 8.49998 9.33333Z"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.5 11.8333C12.7857 11.8333 15.2857 13.2222 16 16H1C1.71429 13.2222 4.21429 11.8333 8.5 11.8333Z"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<div className="pl-4 text-lg">Buyers</div>
					</a>
				</Link>
				<Link href="/cards">
					<a className="p-4 flex items-center justify-center">
						<div>
							<svg
								width="14"
								height="18"
								viewBox="0 0 14 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.4345 4.73592V15.7252C11.1722 15.7252 11.7703 15.1272 11.7703 14.3895V4.06806C11.7703 3.33036 11.1722 2.73234 10.4345 2.73234H3.75597C3.01828 2.73234 2.42026 3.33036 2.42026 4.06806H9.76669C10.1355 4.06806 10.4345 4.36707 10.4345 4.73592Z"
									fill="white"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M1.7524 4.73591H8.43097C9.16867 4.73591 9.76669 5.33393 9.76669 6.07163V16.3931C9.76669 17.1308 9.16867 17.7288 8.43097 17.7288H1.7524C1.01471 17.7288 0.416687 17.1308 0.416687 16.3931V6.07163C0.416687 5.33393 1.01471 4.73591 1.7524 4.73591ZM1.75242 6.07162V16.3931H8.43099V6.07162H1.75242Z"
									fill="white"
								/>
								<path
									d="M12.3991 2.73235V13.7216C13.1368 13.7216 13.7348 13.1236 13.7348 12.3859V2.06449C13.7348 1.3268 13.1368 0.728775 12.3991 0.728775H5.72054C4.98284 0.728775 4.38482 1.3268 4.38482 2.06449H11.7313C12.1001 2.06449 12.3991 2.3635 12.3991 2.73235Z"
									fill="white"
								/>
							</svg>
						</div>
						<div className="pl-4 text-lg">Cards</div>
					</a>
				</Link>
			</div>
		</div>
	)
}

export default Navbar
