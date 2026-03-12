'use client';

import { useHulkStore } from '../stores/store';
import { LoginPage } from './LoginPage';

export function AuthGate({ children }) {
	const auth = useHulkStore((state) => state.auth);

	if (!auth || !auth.token) {
		return <LoginPage />;
	}

	return <>{children}</>;
}
