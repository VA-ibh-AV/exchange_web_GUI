'use client';

import { useEffect, useState } from 'react';
import { useHulkStore } from '../stores/store';
import { LoginPage } from './LoginPage';

function isTokenExpired(token) {
	if (!token) return true;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return (payload.exp || 0) * 1000 <= Date.now();
	} catch {
		return true;
	}
}

export function AuthGate({ children }) {
	const auth = useHulkStore((state) => state.auth);
	const logout = useHulkStore((state) => state.logout);
	const [hydrated, setHydrated] = useState(false);

	// Wait for Zustand persist to rehydrate from localStorage
	useEffect(() => {
		const unsub = useHulkStore.persist.onFinishHydration(() => setHydrated(true));
		// If already hydrated (sync storage), set immediately
		if (useHulkStore.persist.hasHydrated()) setHydrated(true);
		return unsub;
	}, []);

	// If rehydrated token is expired, clear it
	useEffect(() => {
		if (hydrated && auth && auth.token && isTokenExpired(auth.token)) {
			logout();
		}
	}, [hydrated, auth]);

	if (!hydrated) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-900'>
				<div className='text-gray-400'>Loading...</div>
			</div>
		);
	}

	if (!auth || !auth.token) {
		return <LoginPage />;
	}

	return <>{children}</>;
}
