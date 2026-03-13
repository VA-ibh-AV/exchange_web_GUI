'use client';

import { useState } from 'react';
import { useHulkStore } from '../stores/store';

const AUTH_SERVER = 'https://web.sd-projects.uk';

function ChangePasswordModal({ open, onClose, token }) {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setCurrentPassword('');
		setNewPassword('');
		setConfirmPassword('');
		setError('');
		setSuccess(false);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);

		if (newPassword.length < 8) {
			setError('New password must be at least 8 characters');
			return;
		}
		if (newPassword !== confirmPassword) {
			setError('New passwords do not match');
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(AUTH_SERVER + '/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token,
				},
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = await res.json();
			if (!data.success) {
				setError(data.reason || 'Failed to change password');
			} else {
				setSuccess(true);
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
				setTimeout(() => handleClose(), 1200);
			}
		} catch {
			setError('Could not reach auth server');
		} finally {
			setLoading(false);
		}
	};

	if (!open) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'
			onClick={handleClose}
		>
			<div
				className='bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-96'
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='text-lg font-semibold text-white mb-4'>Change Password</h2>
				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<label className='block text-sm text-gray-300 mb-1'>Current Password</label>
						<input
							type='password'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
							className='w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm'
						/>
					</div>
					<div>
						<label className='block text-sm text-gray-300 mb-1'>New Password</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							minLength={8}
							className='w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm'
							placeholder='Min 8 characters'
						/>
					</div>
					<div>
						<label className='block text-sm text-gray-300 mb-1'>Confirm New Password</label>
						<input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
							className='w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm'
						/>
					</div>

					{error && <p className='text-red-400 text-sm'>{error}</p>}
					{success && <p className='text-green-400 text-sm'>Password changed successfully</p>}

					<div className='flex justify-end gap-3 pt-2'>
						<button
							type='button'
							onClick={handleClose}
							className='text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-lg px-4 py-2'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded-lg px-4 py-2'
						>
							{loading ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function NavBarComp() {
	const auth = useHulkStore((state) => state.auth);
	const logout = useHulkStore((state) => state.logout);
	const activeExchange = useHulkStore((state) => state.activeExchange);
	const [showChangePw, setShowChangePw] = useState(false);

	const isLoggedIn = auth && auth.tier !== 'anonymous';

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
					{isLoggedIn && (
						<button
							onClick={() => setShowChangePw(true)}
							className='text-sm text-gray-300 hover:text-white border border-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors'
						>
							Change Password
						</button>
					)}
					{isLoggedIn && (
						<button
							onClick={logout}
							className='text-sm text-gray-300 hover:text-white border border-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors'
						>
							Logout
						</button>
					)}
				</div>
			</div>
			{isLoggedIn && (
				<ChangePasswordModal
					open={showChangePw}
					onClose={() => setShowChangePw(false)}
					token={auth.token}
				/>
			)}
		</nav>
	);
}
