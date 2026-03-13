'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHulkStore } from '../stores/store';

export function SideNavbar() {
	const { exchanges, changeActiveExchange, activeExchange } = useHulkStore(
		(state) => state
	);
	const pathname = usePathname();

	const handleExchangeChange = (e) => {
		const val = e.target.value;
		if (val) changeActiveExchange(val);
	};

	const navLink = (href, label) => {
		const active = pathname === href;
		return (
			<Link
				href={href}
				className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group ${
					active
						? 'bg-gray-700 text-yellow-400'
						: 'text-gray-200 hover:bg-gray-700'
				}`}
			>
				{label}
			</Link>
		);
	};

	return (
		<>
			<button
				data-drawer-target='default-sidebar'
				data-drawer-toggle='default-sidebar'
				aria-controls='default-sidebar'
				type='button'
				className='inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-200 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'
			>
				<span className='sr-only'>Open sidebar</span>
				<svg
					className='w-6 h-6'
					aria-hidden='true'
					fill='currentColor'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						clipRule='evenodd'
						fillRule='evenodd'
						d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
					></path>
				</svg>
			</button>

			<aside
				id='default-sidebar'
				className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
				aria-label='Sidebar'
				aria-hidden={true}
			>
				<div className='h-full px-3 py-4 overflow-y-auto bg-[#002350] text-gray-200'>
					<Link
						href='/'
						className='flex items-center ps-2.5 mb-5'
					>
						<Image
							width={500}
							height={500}
							src='/main_logo.png'
							className='w-full'
							alt='QuantHulk'
						/>
					</Link>
					<ul className='space-y-2 font-medium'>
						<li>
							<form className='max-w-sm mx-auto'>
								<select
									onChange={handleExchangeChange}
									id='countries'
									value={(activeExchange ? activeExchange : '')}
									className='bg-[#003366] border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-300 focus:border-blue-300 block w-full p-2.5'
								>
									<option value=''>Select Exchange</option>
									{Object.keys(exchanges).map(
										(exchange, index) => (
											<option
												value={exchange}
												key={exchange}
											>
												{exchange}
											</option>
										)
									)}
								</select>
							</form>
						</li>
						<li>
							<Link
								href='/'
								className={`flex items-center p-2 rounded-lg group ${
									pathname === '/'
										? 'bg-gray-700 text-yellow-400'
										: 'text-gray-200 hover:bg-gray-700'
								}`}
							>
								<svg
									className='w-5 h-5 transition duration-75'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 22 21'
								>
									<path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
									<path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
								</svg>
								<span className='ms-3'>Home</span>
							</Link>
						</li>

						{activeExchange && (
						<li>
							<button
								type='button'
								className='flex items-center w-full p-2 text-base text-gray-200 transition duration-75 rounded-lg group hover:bg-gray-700'
								aria-controls='dropdown-example'
								data-collapse-toggle='dropdown-example'
							>
								<svg
									className='flex-shrink-0 w-5 h-5 text-gray-300 transition duration-75 group-hover:text-gray-200'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 18 21'
								>
									<path d='M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z' />
								</svg>
								<span className='flex-1 ms-3 text-left rtl:text-right whitespace-nowrap'>
									Market Prices
								</span>
								<svg
									className='w-3 h-3'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 10 6'
								>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='m1 1 4 4 4-4'
									/>
								</svg>
							</button>
							<ul id='dropdown-example' className='py-2 space-y-2'>
								<li>{navLink('/vanilla', 'Vanilla Prices')}</li>
								<li>{navLink('/cross', 'Cross Prices')}</li>
								<li>{navLink('/buckets', 'Buckets')}</li>
							</ul>
						</li>
						)}
					</ul>
				</div>
			</aside>
		</>
	);
}
