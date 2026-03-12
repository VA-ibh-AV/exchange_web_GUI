'use client';

import { useState } from 'react';
import { useHulkStore } from '../stores/store';

const AUTH_SERVER = 'https://web.sd-projects.uk';

function getDeviceId() {
	let id = localStorage.getItem('qh_device_id');
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem('qh_device_id', id);
	}
	return id;
}

export function LoginPage() {
	const [mode, setMode] = useState('login'); // 'login' | 'register'
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const setAuth = useHulkStore((state) => state.setAuth);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setLoading(true);

		const deviceId = getDeviceId();
		const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
		try {
			const res = await fetch(AUTH_SERVER + endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, deviceId }),
			});
			const data = await res.json();
			if (!data.success) {
				setError(data.reason || 'Authentication failed');
			} else {
				setAuth({ token: data.token, tier: data.tier || 'free', email, feed_server: data.feed_server, savedSubscriptions: data.savedSubscriptions || [] });
			}
		} catch (err) {
			setError('Could not reach auth server');
		} finally {
			setLoading(false);
		}
	}

	async function handleAnonymous() {
		setError('');
		setLoading(true);
		try {
			const res = await fetch(AUTH_SERVER + '/auth/anonymous', {
				method: 'POST',
			});
			const data = await res.json();
			if (!data.success) {
				setError(data.reason || 'Could not get anonymous access');
			} else {
				setAuth({ token: data.token, tier: 'anonymous', email: null, feed_server: data.feed_server });
			}
		} catch (err) {
			setError('Could not reach auth server');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-900'>
			<div className='w-full max-w-md'>
				{/* Logo / Title */}
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-extrabold text-white tracking-tight'>
						Quant<span className='text-yellow-400'>Hulk</span>
					</h1>
					<p className='mt-2 text-gray-400'>
						Real-time crypto price feeds
					</p>
				</div>

				{/* Card */}
				<div className='bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700'>
					{/* Tabs */}
					<div className='flex mb-6 border-b border-gray-600'>
						<button
							onClick={() => { setMode('login'); setError(''); }}
							className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
								mode === 'login'
									? 'text-yellow-400 border-b-2 border-yellow-400'
									: 'text-gray-400 hover:text-gray-200'
							}`}
						>
							Sign In
						</button>
						<button
							onClick={() => { setMode('register'); setError(''); }}
							className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
								mode === 'register'
									? 'text-yellow-400 border-b-2 border-yellow-400'
									: 'text-gray-400 hover:text-gray-200'
							}`}
						>
							Register
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-gray-300 mb-1'>
								Email
							</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
								placeholder='you@example.com'
							/>
						</div>
						<div>
							<label className='block text-sm text-gray-300 mb-1'>
								Password
							</label>
							<input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
								className='w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
								placeholder='Min 8 characters'
							/>
						</div>

						{error && (
							<p className='text-red-400 text-sm'>{error}</p>
						)}

						<button
							type='submit'
							disabled={loading}
							className='w-full py-2.5 rounded-lg font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 transition-colors'
						>
							{loading
								? 'Please wait...'
								: mode === 'login'
								? 'Sign In'
								: 'Create Account'}
						</button>
					</form>

					{/* Divider */}
					<div className='flex items-center my-6'>
						<div className='flex-1 border-t border-gray-600'></div>
						<span className='px-3 text-sm text-gray-400'>or</span>
						<div className='flex-1 border-t border-gray-600'></div>
					</div>

					{/* Anonymous */}
					<button
						onClick={handleAnonymous}
						disabled={loading}
						className='w-full py-2.5 rounded-lg font-semibold text-white border border-gray-500 hover:bg-gray-700 disabled:opacity-50 transition-colors'
					>
						Continue as Guest
					</button>
					<p className='text-xs text-gray-500 text-center mt-2'>
						Guest access: limited subscriptions, 30 min session
					</p>
				</div>
			</div>
		</div>
	);
}
