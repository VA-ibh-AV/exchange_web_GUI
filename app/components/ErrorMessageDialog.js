'use client';

import { useHulkStore } from '../stores/store';

export function ErrorMessageDialog() {
	const errors = useHulkStore((state) => state.errors);
	const clearErrors = useHulkStore((state) => state.clearErrors);

	const onClose = () => {
		clearErrors();
	};

	if (errors && errors.length > 0) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50'>
				<div className='bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 w-96'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-semibold text-red-400'>
							Error
						</h2>
						<button
							className='text-gray-400 hover:text-white'
							onClick={onClose}
						>
							&#10005;
						</button>
					</div>
					{errors.map((err, idx) => (
						<p className='text-gray-300 text-sm' key={idx}>
							{err.message}
						</p>
					))}
					<div className='mt-6 flex justify-end'>
						<button
							className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
							onClick={onClose}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}
