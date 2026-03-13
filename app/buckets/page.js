'use client';
import SubscriptionTable from '../components/SubscriptionTable';
import {
	subscriptionTypeEnum,
	useHulkStore,
} from '../stores/store';
import { useState } from 'react';
import BucketSelectionModel from '../components/BucketSelectionModel';

export default function Component() {
	const { addSubscription, exchanges, activeExchange } = useHulkStore(
		(state) => state
	);

	const cols = ['Symbols', 'Target Symbol', 'Last Trade Price', 'Actions'];

	const [open, setOpen] = useState(false);

	const handleConfirm = (bucketSymbols, destinationSymbol) => {
		const symbolId =
			bucketSymbols.reduce(
				(total, val) => (total += val.baseAsset + val.count + '-'),
				''
			) + destinationSymbol;

		addSubscription(subscriptionTypeEnum.BASKETS, {
			symbol: symbolId,
			assets: bucketSymbols,
			destinationSymbol: destinationSymbol,
		});

		setOpen(false);
	};

	return (
		<>
			<div className='m-12 mx-24'>
				{!activeExchange ? (
					<div className='flex flex-col items-center justify-center h-64 text-gray-400'>
						<p className='text-lg'>Select an exchange from the sidebar to view prices</p>
					</div>
				) : (
				<>
				<div className='mb-6'>
					<button
						className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						onClick={() => setOpen(true)}
					>
						+ New Bucket
					</button>
					<BucketSelectionModel
						open={open}
						onCancel={() => setOpen(false)}
						onConfirm={handleConfirm}
						exchanges={exchanges}
						activeExchange={activeExchange}
					/>
				</div>

				{
					<div className='mt-4'>
						<SubscriptionTable
							cols={cols}
							currentTAB={subscriptionTypeEnum.BASKETS}
						/>
					</div>
				}

				<div className='w-full h-44'></div>
				</>
				)}
			</div>
		</>
	);
}
