'use client';
import { useEffect } from 'react';
import { subscriptionTypeEnum, useHulkStore } from '../stores/store';
import VanillaTableRow from './VanillaTableRow';
import CrossTableRow from './CrossTableRow';
import BucketTableRow from './BucketTableRow';

export default function VanillaSubscriptionCollasableTable({
	cols,
	currentTAB,
}) {
	const { subscribe, subscriptions, activeExchange } = useHulkStore(
		(state) => state
	);

	// useEffect(() => {
	// 	//active
	// 	console.log('active exchange change');
	// }, [activeExchange]);

	if (currentTAB == subscriptionTypeEnum.VANILLA) {
		return (
			<div id='accordion-collapse' data-accordion='collapse'>
				<div className='my-2 flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-md focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
					{cols.map((col) => (
						<div key={col} className='w-1/4 items-center'>
							{col}
						</div>
					))}
				</div>

				{subscriptions &&
					activeExchange &&
					subscriptions[activeExchange][currentTAB].map(
						(data, idx) => {
							return (
								<VanillaTableRow
									currentTAB={currentTAB}
									activeExchange={activeExchange}
									subsciption={data}
									key={data.symbol}
								/>
							);
						}
					)}
			</div>
		);
	} else if (currentTAB == subscriptionTypeEnum.CROSS_PRICE) {
		return (
			<div id='accordion-collapse' data-accordion='collapse'>
				<div className='my-2 flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-md focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
					{cols.map((col) => (
						<div key={col} className='w-1/4 items-center'>
							{col}
						</div>
					))}
				</div>

				{subscriptions &&
					activeExchange &&
					subscriptions[activeExchange][currentTAB].map(
						(data, idx) => {
							return (
								<CrossTableRow
									currentTAB={currentTAB}
									activeExchange={activeExchange}
									subsciption={data}
									key={data.symbol}
								/>
							);
						}
					)}
			</div>
		);
	} else if (currentTAB == subscriptionTypeEnum.BASKETS) {
		return (
			<div id='accordion-collapse' data-accordion='collapse'>
				<div className='my-2 flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 rounded-md focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3'>
					{cols.map((col) => (
						<div key={col} className='w-1/4 items-center'>
							{col}
						</div>
					))}
				</div>

				{subscriptions &&
					activeExchange &&
					subscriptions[activeExchange][currentTAB].map(
						(data, idx) => {
							return (
								<BucketTableRow
									currentTAB={currentTAB}
									activeExchange={activeExchange}
									subsciption={data}
									key={data.symbol}
								/>
							);
						}
					)}
			</div>
		);
	}

	return null;
}
