'use client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import VanillaSubscriptionCollasableTable from '../components/SubscriptionTable';
import {
	subscriptionTypeEnum,
	subsTypeEnum,
	useHulkStore,
} from '../stores/store';
import { useEffect, useState } from 'react';

export default function Component() {
	const { addSubscription, exchanges, activeExchange } = useHulkStore(
		(state) => state
	);

	const [selectedSymbol, setSelectedSymbol] = useState(null);
	const [selectedSecondSymbol, setSecondSelectedSymbol] = useState(null);
	const [filteredSecondSymbols, setFilteredSecondSymbols] = useState([]);
	const [disabledSecondAutoComplete, setDisabledSecondAutoComplete] =
		useState(true);

	const handleChange = (event, newValue) => {
		// if (checkSymbolsBase()) {
		// 	setSelectedSymbol(newValue);
		// } else {
		setSelectedSymbol(newValue);
		// filter all the second symbols
		setSecondSelectedSymbol(null);

		if (newValue != null) {
			setFilteredSecondSymbols(
				Object.keys(exchanges[activeExchange].symbols).filter(
					(curr) =>
						exchanges[activeExchange].symbols[curr].quoteAsset ==
						exchanges[activeExchange].symbols[newValue].quoteAsset
				)
			);
			setDisabledSecondAutoComplete(false);
		} else {
			setDisabledSecondAutoComplete(true);
		}
		// }
	};

	const handleSecondSymbolChange = (event, newValue) => {
		setSecondSelectedSymbol(newValue);
	};

	const handleAddSubscription = () => {
		if (selectedSymbol != null && selectedSecondSymbol != null) {
			addSubscription(subscriptionTypeEnum.CROSS_PRICE, {
				symbol: `${selectedSymbol}-${selectedSecondSymbol}`,
				baseAssets: [
					exchanges[activeExchange].symbols[selectedSymbol].baseAsset,
					exchanges[activeExchange].symbols[selectedSecondSymbol]
						.baseAsset,
				],
				quoteAsset:
					exchanges[activeExchange].symbols[selectedSymbol]
						.quoteAsset,
			});
		}
	};

	useEffect(() => {
		if (activeExchange)
			setFilteredSecondSymbols(
				Object.keys(exchanges[activeExchange].symbols)
			);
	}, [activeExchange]);

	const cols = [
		'First Symbol',
		'Second Symbol',
		'Last Trade Price',
		'Actions',
	];

	// console.log('redendered.....');
	// console.log(exchanges[activeExchange].symbols);
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
						value={selectedSymbol}
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

				<div>
					<label
						htmlFor='countries'
						className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'
					>
						Select an Second Symbol
					</label>
					<Autocomplete
						disablePortal
						id='combo-box-demo'
						value={selectedSecondSymbol}
						disabled={disabledSecondAutoComplete}
						options={activeExchange ? filteredSecondSymbols : []}
						sx={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label='Symbol' />
						)}
						onChange={handleSecondSymbolChange}
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
					currentTAB={subscriptionTypeEnum.CROSS_PRICE}
				/>
			</div>

			<div className='w-full h-44'></div>
			</>
			)}
		</div>
	);
}
