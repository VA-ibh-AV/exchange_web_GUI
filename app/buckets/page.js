'use client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SubscriptionTable from '../components/SubscriptionTable';
import {
	subscriptionTypeEnum,
	subsTypeEnum,
	useHulkStore,
} from '../stores/store';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import BucketSelectionModel from '../components/BucketSelectionModel';
import BucketSymbolContiner from '../components/BucketSymbolsContainer';

export default function Component() {
	const { addSubscription, exchanges, activeExchange } = useHulkStore(
		(state) => state
	);

	const cols = ['Symbols', 'Target Symbol', 'Last Trade Price', 'Actions'];

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [bucketSymbols, setBucketSymbols] = useState([]);
	const [destinationSymbol, setDestinationSymbol] = useState(null);
	const [disableDestinationSymbol, setDisableDestinationSymbol] =
		useState(true);
	const [filteredDestinationSymbol, setFilteredDestinationSymbol] = useState(
		[]
	);

	useEffect(() => {
		// if(activeExchange){
		// const uniqueBaseAssests = [ new Set(Object.keys(exchanges[activeExchange].symbols).map((symbol) => exchanges[activeExchange].symbols[symbol].baseAsset))]

		setFilteredDestinationSymbol(
			activeExchange ? Object.keys(exchanges[activeExchange].symbols) : []
		);

		// }
	}, [activeExchange]);

	const addBucketSymbol = (newBucketSymbol) => {
		setBucketSymbols([...bucketSymbols, newBucketSymbol]);

		setFilteredDestinationSymbol(
			Object.keys(exchanges[activeExchange].symbols).filter(
				(val) =>
					exchanges[activeExchange].symbols[val].quoteAsset ==
					exchanges[activeExchange].symbols[newBucketSymbol.symbol]
						.quoteAsset
			)
		);
		setDisableDestinationSymbol(false);
	};

	const removeBucketSymbol = (removeSymbol) => {
		setBucketSymbols(
			bucketSymbols.filter((val) => val.symbol != removeSymbol)
		);
	};

	const handleDestinationSymbolChange = (event, newVal) => {
		setDestinationSymbol(newVal);
	};

	const handleAddSubscription = () => {
		if (destinationSymbol != null && bucketSymbols.length > 0) {
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

			setBucketSymbols([]);
		}
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
				<form className='flex items-center justify-between space-x-2'>
					<div className='flex items-start'>
						<div>
							<label
								htmlFor='countries'
								className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'
							>
								Select Bucket
							</label>

							{bucketSymbols.length > 0 ? (
								<BucketSymbolContiner
									bucketSymbols={bucketSymbols}
								/>
							) : (
								''
							)}

							<Button
								className='bg-blue-950 hover:bg-blue-500 px-10 py-3 text-white hover:text-blue-950'
								onClick={handleOpen}
							>
								Choose
							</Button>
							<BucketSelectionModel
								open={open}
								handleClose={handleClose}
								exchanges={exchanges}
								activeExchange={activeExchange}
								bucketSymbols={bucketSymbols}
								setBucketSymbols={addBucketSymbol}
								removeBucketSymbol={removeBucketSymbol}
							/>
						</div>

						<div className='flex items-end'>
							<div className='ml-12'>
								<label
									htmlFor='countries'
									className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'
								>
									Select an Asset
								</label>
								<Autocomplete
									disabled={disableDestinationSymbol}
									disablePortal
									id='combo-box-demo'
									onChange={handleDestinationSymbolChange}
									options={filteredDestinationSymbol.map(
										(symbol) =>
											exchanges[activeExchange].symbols[
												symbol
											].baseAsset
									)}
									sx={{ width: 300 }}
									renderInput={(params) => (
										<TextField {...params} label='Asset' />
									)}
								/>
							</div>

							<button
								onClick={handleAddSubscription}
								type='button'
								className='ml-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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
						</div>
					</div>
				</form>

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
