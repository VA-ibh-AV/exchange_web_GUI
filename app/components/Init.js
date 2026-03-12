'use client';

import { useEffect } from 'react';
import { useHulkStore } from '../stores/store';

export function InitConection() {
	const auth = useHulkStore((state) => state.auth);
	const init = useHulkStore((state) => state.init);
	const isReady = useHulkStore((state) => state.isReady);

	useEffect(() => {
		if (auth && auth.token && !isReady) {
			init();
		}
	}, [auth]);

	return <></>;
}
