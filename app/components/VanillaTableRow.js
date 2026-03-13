'use client';

import { useCallback, useEffect, useState } from 'react';
import {
	DepthActions,
	subscriptionTypeEnum,
	subsTypeEnum,
	useHulkStore,
} from '../stores/store';
import { UpArrow, DownArrow } from './UtilsComponents';

export default function SubscriptionTableRow(props) {
	const { symbol, depth, depth_cb } = props.subsciption;
	const {
		subscribe,
		unsubscribe,
		manageDepthSubscription,
		removeSubscription,
	} = useHulkStore((state) => state);
	const [currSub, setCurrSub] = useState({
		price: 0,
		quantity: 0,
		lastPrice: 0,
	});
	const [showDepth, setShowDepth] = useState(depth);
	const [depths, setDepths] = useState({
		bids: [],
		asks: [],
	});

	let lastPrice = 0;
	const handleSymbolUnsubscription = () => {
		unsubscribe(
			props.currentTAB,
			symbol,
			props.activeExchange,
			subsTypeEnum.TRADE,
			tradeCallback
		);
		removeSubscription(props.currentTAB, symbol);

		if (showDepth) {
			manageDepthSubscription(
				props.currentTAB,
				symbol,
				DepthActions.UNSUBSCRIBE
			);
			unsubscribe(
				props.currentTAB,
				symbol,
				props.activeExchange,
				subsTypeEnum.DEPTH,
				depthCallback
			);
		}
	};

	const handleDepthSubscription = () => {
		if (!showDepth) {
			manageDepthSubscription(
				props.currentTAB,
				symbol,
				DepthActions.SUBSCRIBE
			);
			subscribe(
				props.currentTAB,
				symbol,
				props.activeExchange,
				subsTypeEnum.DEPTH,
				depthCallback
			);
		} else {
			manageDepthSubscription(
				props.currentTAB,
				symbol,
				DepthActions.UNSUBSCRIBE
			);
			unsubscribe(
				props.currentTAB,
				symbol,
				props.activeExchange,
				subsTypeEnum.DEPTH,
				depthCallback
			);
		}

		setShowDepth(!showDepth);
	};

	const depthCallback = useCallback((data) => {
		setDepths({
			asks: data.asks,
			bids: data.bids,
		});
	}, []);

	const tradeCallback = useCallback((data) => {
		setCurrSub({
			lastPrice: lastPrice,
			price: data.price,
			quantity: data.quantity,
		});
		lastPrice = data.price;
	}, []);

	useEffect(() => {
		setCurrSub({ price: 0, quantity: 0, lastPrice: 0 });
		subscribe(
			props.currentTAB,
			symbol,
			props.activeExchange,
			subsTypeEnum.TRADE,
			tradeCallback
		);

		if (showDepth) {
			setDepths({
				bids: [],
				asks: [],
			});
			subscribe(
				props.currentTAB,
				symbol,
				props.activeExchange,
				subsTypeEnum.DEPTH,
				depthCallback
			);
		}
	}, [symbol, props.activeExchange]);

	// useEffect(() => {
	// 	console.log('depth changed', depth, depth_cb);

	// 	if (!depth && depth_cb) {
	// 		setShowDepth(false);
	// 		unsubscribe(
	// 			props.currentTAB,
	// 			symbol,
	// 			props.activeExchange,
	// 			subsTypeEnum.DEPTH,
	// 			depth_cb
	// 		);
	// 	} else if (depth && !depth_cb) {
	// 		setShowDepth(true);
	// 		subscribe(
	// 			props.currentTAB,
	// 			symbol,
	// 			props.activeExchange,
	// 			subsTypeEnum.DEPTH,
	// 			depthCallback
	// 		);
	// 	} else if (!depth) {
	// 		setShowDepth(false);
	// 		setDepths({
	// 			bids: [],
	// 			asks: [],
	// 		});
	// 	} else if (depth && depth_cb) {
	// 		unsubscribe(
	// 			props.currentTAB,
	// 			symbol,
	// 			props.activeExchange,
	// 			subsTypeEnum.DEPTH,
	// 			depth_cb
	// 		);
	// 		subscribe(
	// 			props.currentTAB,
	// 			symbol,
	// 			props.activeExchange,
	// 			subsTypeEnum.DEPTH,
	// 			depthCallback
	// 		);
	// 		setShowDepth(true);
	// 	}
	// }, [depth]);

	// useEffect(() => {
	// 	console.log('active exchane has changed inside subscribe val');
	// }, []);

	// console.log('price', lastPrice);

	if (props.currentTAB == subscriptionTypeEnum.VANILLA) {
		return (
			<>
				<div className='my-2 flex items-center w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-300 rounded-md focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
					<div className='w-1/4'>{symbol}</div>
					<div
						className={
							currSub.price >= currSub.lastPrice
								? 'text-green-600 flex items-center w-1/4'
								: 'text-red-700 flex items-center w-1/4'
						}
					>
						{currSub.price >= currSub.lastPrice ? (
							<UpArrow />
						) : (
							<DownArrow />
						)}

						{currSub.price}
					</div>
					<div className='w-1/4'>{currSub.quantity}</div>
					<div className='w-1/4'>
						<button
							onClick={handleDepthSubscription}
							type='button'
							className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
						>
							{showDepth ? 'Hide Depth' : 'Show Depth'}
						</button>
						<button
							onClick={handleSymbolUnsubscription}
							type='button'
							className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
						>
							Remove
						</button>
					</div>
				</div>

				<div
					id='accordion-collapse-body-1'
					aria-labelledby='accordion-collapse-heading-1'
					className={
						showDepth ? 'visible border border-blue-950' : 'hidden'
					}
				>
					<div className='relative overflow-x-auto'>
						<div className='flex px-6 py-2 bg-[#002350] text-white'>
							<p
								style={{
									width: '50%',
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								Bids
							</p>
							<p
								style={{
									width: '50%',
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								Asks
							</p>
						</div>
						<table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
							<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
								<tr>
									<th scope='col' className='px-6 py-3'>
										Price
									</th>
									<th scope='col' className='px-6 py-3'>
										Quantity
									</th>
									<th scope='col' className='px-6 py-3'>
										Price
									</th>
									<th scope='col' className='px-6 py-3'>
										Quantity
									</th>
								</tr>
							</thead>

							<tbody>
								{depths &&
									depths.bids &&
									depths.asks &&
									depths.bids.map((bid, idx) => {
										return (
											<tr
												key={idx}
												className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
											>
												<td className='px-6 py-1 text-green-600'>
													{bid[0]}
												</td>
												<td className='px-6 py-1'>
													{bid[1]}
												</td>
												<td className='px-6 py-1 text-red-600'>
													{depths.asks[idx][0]}
												</td>
												<td className='px-6 py-1'>
													{depths.asks[idx][1]}
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>
				</div>
			</>
		);
	}

	return <>hello world</>;
}
