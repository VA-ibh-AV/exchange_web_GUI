'use client';

import Link from 'next/link';
import { useHulkStore } from '../stores/store';

export function NavBarComp() {
	const auth = useHulkStore((state) => state.auth);
	const logout = useHulkStore((state) => state.logout);
	const activeExchange = useHulkStore((state) => state.activeExchange);

	return (
		<nav className='bg-[#002350]'>
			<div className='flex items-center justify-between px-6 py-3'>
				<div className='flex items-center gap-3'>
					{activeExchange && (
						<span className='text-sm font-medium text-yellow-400 tracking-wide'>
							{activeExchange}
						</span>
					)}
				</div>
				<div className='flex items-center gap-3'>
					{auth && (
						<span className='text-xs text-gray-300 uppercase tracking-wide'>
							{auth.tier}
						</span>
					)}
					<button
						onClick={logout}
						className='text-sm text-gray-300 hover:text-white border border-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors'
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
