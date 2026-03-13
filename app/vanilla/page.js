'use client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import VanillaSubscriptionCollasableTable from '../components/SubscriptionTable';
import {
	subscriptionTypeEnum,
	subsTypeEnum,
	useHulkStore,
} from '../stores/store';
import { useState } from 'react';

export default function Component() {
	const { addSubscription, exchanges, activeExchange } = useHulkStore(
		(state) => state
	);

	const [selectedSymbol, setSelectedSymbol] = useState(null);

	const handleChange = (event, newValue) => {
		setSelectedSymbol(newValue);
	};
	const handleAddSubscription = () => {
		if (selectedSymbol != null) {
			addSubscription(subscriptionTypeEnum.VANILLA, {
				symbol: selectedSymbol,
				depth: false,
			});
		}
	};

	const cols = [
		'Symbol',
		'Last Trade Price',
		'Last Trade Quantity',
		'Actions',
	];

	// console.log('redendered.....');
	// if (activeExchange) console.log(exchanges[activeExchange]);
	// if (activeExchange == '') {
	// 	alert('please select an exchange');
	// }

	return (
		<div className='m-12 mx-24'>
			{!activeExchange ? (
				<div className='flex flex-col items-center justify-center h-64 text-gray-400'>
					<p className='text-lg'>Select an exchange from the sidebar to view prices</p>
				</div>
			) : (
			<>
			<form className='flex items-center justify-between space-x-2'>
				<div>
					<label
						htmlFor='countries'
						className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'
					>
						Select an Symbol
					</label>
					<Autocomplete
						disablePortal
						id='combo-box-demo'
						options={
							activeExchange
								? Object.keys(exchanges[activeExchange].symbols)
								: []
						}
						sx={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label='Symbol' />
						)}
						onChange={handleChange}
					/>
				</div>

				<button
					onClick={handleAddSubscription}
					type='button'
					className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				>
					Add
					<svg
						className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 14 10'
					>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M1 5h12m0 0L9 1m4 4L9 9'
						/>
					</svg>
				</button>
			</form>

			<div className='mt-4'>
				<VanillaSubscriptionCollasableTable
					cols={cols}
					currentTAB={subscriptionTypeEnum.VANILLA}
				/>
			</div>

			<div className='w-full h-44'></div>
			</>
			)}
		</div>
	);
}
