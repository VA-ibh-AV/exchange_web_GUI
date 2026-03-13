'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '55%',
	bgcolor: 'background.paper',
	borderRadius: '8px',
	boxShadow: 24,
	p: 4,
};

export default function BucketSelectionModel({
	open,
	onCancel,
	onConfirm,
	exchanges,
	activeExchange,
}) {
	const [bucketSymbols, setBucketSymbols] = useState([]);
	const [destinationSymbol, setDestinationSymbol] = useState(null);
	const [currentBucketSymbol, setCurrentBucketSymbol] = useState({
		symbol: null,
		baseAsset: null,
		quoteAsset: null,
		count: 0,
	});

	const [filteredSymbols, setFilterSymbols] = useState([]);
	const [filteredDestinationSymbols, setFilteredDestinationSymbols] = useState([]);

	// Reset all state when modal opens
	useEffect(() => {
		if (open) {
			setBucketSymbols([]);
			setDestinationSymbol(null);
			setCurrentBucketSymbol({ symbol: null, baseAsset: null, quoteAsset: null, count: 0 });
			if (activeExchange) {
				setFilterSymbols(Object.keys(exchanges[activeExchange].symbols));
			}
			setFilteredDestinationSymbols([]);
		}
	}, [open]);

	const handleChange = (event, newValue) => {
		setCurrentBucketSymbol({
			...currentBucketSymbol,
			symbol: newValue,
			quoteAsset: newValue
				? exchanges[activeExchange].symbols[newValue].quoteAsset
				: null,
			baseAsset: newValue
				? exchanges[activeExchange].symbols[newValue].baseAsset
				: null,
		});

		if (newValue != null && newValue != '') {
			setFilterSymbols(
				Object.keys(exchanges[activeExchange].symbols).filter(
					(curr) =>
						exchanges[activeExchange].symbols[curr].quoteAsset ==
						exchanges[activeExchange].symbols[newValue].quoteAsset
				)
			);
		} else {
			setFilterSymbols(Object.keys(exchanges[activeExchange].symbols));
		}
	};

	const handlenewBucketItem = () => {
		if (
			currentBucketSymbol.symbol != null &&
			currentBucketSymbol.count != null &&
			currentBucketSymbol.count != '' &&
			currentBucketSymbol.count > 0
		) {
			const newSymbols = [...bucketSymbols, currentBucketSymbol];
			setBucketSymbols(newSymbols);

			// Update destination symbol filter based on quote asset
			setFilteredDestinationSymbols(
				Object.keys(exchanges[activeExchange].symbols).filter(
					(val) =>
						exchanges[activeExchange].symbols[val].quoteAsset ==
						exchanges[activeExchange].symbols[currentBucketSymbol.symbol].quoteAsset
				)
			);
		}
	};

	const handleRemoveBucketSymbol = (removeSymbol) => {
		const newSymbols = bucketSymbols.filter((val) => val.symbol != removeSymbol);
		setBucketSymbols(newSymbols);
		if (newSymbols.length === 0) {
			setFilteredDestinationSymbols([]);
			setDestinationSymbol(null);
		}
	};

	const handleCountChange = (e) => {
		const val = e.target.value;
		if (val != null && val != '') {
			setCurrentBucketSymbol({
				...currentBucketSymbol,
				count: Number.parseFloat(val),
			});
		} else {
			setCurrentBucketSymbol({
				...currentBucketSymbol,
				count: '',
			});
		}
	};

	const handleConfirm = () => {
		if (destinationSymbol != null && bucketSymbols.length > 0) {
			onConfirm(bucketSymbols, destinationSymbol);
		}
	};

	const canConfirm = destinationSymbol != null && bucketSymbols.length > 0;

	return (
		<Modal
			open={open}
			onClose={onCancel}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
					Configure Bucket
				</h2>

				{/* Step 1: Add symbols */}
				<div className='flex items-end'>
					<div>
						<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Select Symbol
						</label>
						<Autocomplete
							disablePortal
							onChange={handleChange}
							options={filteredSymbols}
							sx={{ width: 300 }}
							renderInput={(params) => (
								<TextField {...params} label='Symbol' />
							)}
						/>
					</div>
					<div className='ml-8'>
						<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Count
						</label>
						<input
							onChange={handleCountChange}
							value={currentBucketSymbol.count}
							type='number'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							placeholder='1'
							step={0.0000000000001}
							min={0}
							required
						/>
					</div>
					<button
						onClick={handlenewBucketItem}
						type='button'
						className='ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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

				{/* Bucket symbols list */}
				<div className='mt-6'>
					<h3 className='text-sm font-medium text-gray-900 dark:text-white'>
						Bucket Symbols
					</h3>
					<div className='mt-2 symbols flex flex-wrap min-h-[32px]'>
						{bucketSymbols.length === 0 ? (
							<span className='text-sm text-gray-400'>No symbols added yet</span>
						) : (
							bucketSymbols.map((curr, idx) => (
								<span
									key={idx}
									className='inline-flex items-center px-2 py-1 me-2 mb-1 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300'
								>
									{curr.baseAsset}
									<span className='inline-flex items-center justify-center py-0.5 px-1 ms-2 text-xs font-semibold text-white bg-blue-950 rounded-full'>
										{curr.count}
									</span>
									<button
										onClick={() => handleRemoveBucketSymbol(curr.symbol)}
										type='button'
										className='inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300'
										aria-label='Remove'
									>
										<svg
											className='w-2 h-2'
											aria-hidden='true'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 14 14'
										>
											<path
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
											/>
										</svg>
										<span className='sr-only'>Remove</span>
									</button>
								</span>
							))
						)}
					</div>
				</div>

				{/* Step 2: Target asset (enabled after at least one symbol added) */}
				<div className='mt-6'>
					<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Target Asset
					</label>
					<Autocomplete
						disabled={bucketSymbols.length === 0}
						disablePortal
						value={destinationSymbol}
						onChange={(e, newVal) => setDestinationSymbol(newVal)}
						options={filteredDestinationSymbols.map(
							(symbol) => exchanges[activeExchange].symbols[symbol].baseAsset
						)}
						sx={{ width: 300 }}
						renderInput={(params) => (
							<TextField {...params} label='Asset' />
						)}
					/>
				</div>

				{/* Actions */}
				<div className='flex justify-end mt-6 gap-3'>
					<button
						onClick={onCancel}
						type='button'
						className='text-gray-300 bg-gray-600 hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5'
					>
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						disabled={!canConfirm}
						type='button'
						className={`font-medium rounded-lg text-sm px-5 py-2.5 text-white ${
							canConfirm
								? 'bg-green-600 hover:bg-green-700'
								: 'bg-gray-500 cursor-not-allowed'
						}`}
					>
						Confirm
					</button>
				</div>
			</Box>
		</Modal>
	);
}
