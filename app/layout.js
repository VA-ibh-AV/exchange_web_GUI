import { Inter } from 'next/font/google';
import './globals.css';
import { SideNavbar } from './components/SideNav';
import { NavBarComp } from './components/Navbar';
import { InitConection } from './components/Init';
import { ErrorMessageDialog } from './components/ErrorMessageDialog';
import { AuthGate } from './components/AuthGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Quant Hulk',
	description: 'Quant Hulk',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<script
					async
					src='https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js'
				></script>
			</head>
			<body className={inter.className}>
				<AuthGate>
					<InitConection />
					<ErrorMessageDialog />
					<div className='flex h-screen'>
						<SideNavbar />
						<div className='ml-64 w-full'>
							<NavBarComp />
							{children}
						</div>
					</div>
				</AuthGate>
			</body>
		</html>
	);
}
