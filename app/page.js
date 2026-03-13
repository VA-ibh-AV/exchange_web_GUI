'use client';
import { useHulkStore } from './stores/store';

export default function Home() {
	const isReady = useHulkStore((state) => state.isReady);

	if (isReady) {
		return (
			<div className='bg-gray-900 h-full overflow-y-auto px-8 py-10'>
				<div className='max-w-4xl mx-auto'>
					{/* Header */}
					<h1 className='text-3xl font-bold text-white mb-2'>
						Quant<span className='text-yellow-400'>Hulk</span>
					</h1>
					<p className='text-gray-400 mb-10'>
						Real-time cryptocurrency price feeds. Select an exchange from the sidebar to get started.
					</p>

					{/* Feature cards */}
					<div className='grid gap-6 md:grid-cols-3'>
						{/* Vanilla */}
						<div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>
							<div className='flex items-center gap-2 mb-3'>
								<span className='text-xl'>📈</span>
								<h2 className='text-lg font-semibold text-white'>Vanilla Prices</h2>
							</div>
							<p className='text-sm text-gray-400 leading-relaxed'>
								Subscribe to real-time trade prices and order book depth for individual trading pairs like BTCUSDT or ETHUSDT. Toggle depth view to see live bid/ask levels.
							</p>
						</div>

						{/* Cross */}
						<div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>
							<div className='flex items-center gap-2 mb-3'>
								<span className='text-xl'>🔀</span>
								<h2 className='text-lg font-semibold text-white'>Cross Prices</h2>
							</div>
							<p className='text-sm text-gray-400 leading-relaxed'>
								Compute synthetic cross rates between two assets that share a common quote currency. For example, derive a live BTC/ETH price from BTC/USDT and ETH/USDT feeds.
							</p>
						</div>

						{/* Buckets */}
						<div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>
							<div className='flex items-center gap-2 mb-3'>
								<span className='text-xl'>🪣</span>
								<h2 className='text-lg font-semibold text-white'>Buckets</h2>
							</div>
							<p className='text-sm text-gray-400 leading-relaxed'>
								Build a weighted basket of assets (e.g. 0.5 BTC + 2 ETH) and track its combined value in a target currency in real time. Useful for portfolio-level price monitoring.
							</p>
						</div>
					</div>

					{/* Quick start */}
					<div className='mt-10 bg-gray-800 border border-gray-700 rounded-lg p-6'>
						<h2 className='text-lg font-semibold text-white mb-3'>Getting Started</h2>
						<ol className='text-sm text-gray-400 space-y-2 list-decimal list-inside'>
							<li>Pick an exchange from the dropdown in the sidebar</li>
							<li>Navigate to Vanilla, Cross, or Buckets from the menu that appears</li>
							<li>Search for symbols, add subscriptions, and watch prices stream in</li>
						</ol>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className='flex items-center justify-center w-full h-full bg-gray-900'>
				<div role='status'>
					<svg
						aria-hidden='true'
						className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
						viewBox='0 0 100 101'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
							fill='currentColor'
						/>
						<path
							d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
							fill='currentFill'
						/>
					</svg>
					<span className='sr-only'>Loading...</span>
				</div>
			</div>
		);
	}
}
