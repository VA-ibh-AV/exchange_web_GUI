import { create } from 'zustand';
import {
	subscribe,
	unsubscribe,
	init,
	subscribeVirtual,
	unsubscribeVirtual,
	subscribeBasket,
	unsubscribeBasket,
} from '../root/Gui-Library-Interface';

// const subscriptions = {
//     "exchange_key": {
//         "vanilla": [],
//         "crossPrices": [],
//         "baskets": []
//     }
// }

// const symbols = ["BTCUSDT",""];

// const exchanges = {
//     "key_1": {
//         "lastTab": ""
//     }
// }

export const subscriptionTypeEnum = {
	VANILLA: 'vanilla',
	CROSS_PRICE: 'crossPrices',
	BASKETS: 'baskets',
};

export const subsTypeEnum = {
	TRADE: 'trade',
	DEPTH: 'depth',
};

export const DepthActions = {
	SUBSCRIBE: true,
	UNSUBSCRIBE: false,
};

export const logger = {
	debug: (str) => console.log(str),
	info: (str) => console.log(str),
	warn: (str) => console.log(str),
	error: (str) => console.log(str),
};

const initErrorCB = (autParameters, logger, staticDataCB, errorCB) => {
	try {
		init(autParameters, logger, staticDataCB);
	} catch (error) {
		errorCB(error);
	}
};

const subscribeErrorCB = (symbol, exchange, subsType, cb, errorCB) => {
	try {
		subscribe(symbol, exchange, subsType, cb);
	} catch (error) {
		errorCB(error);
	}
};

const unsubscribeErrorCB = (symbol, exchange, subsType, cb, errorCB) => {
	try {
		unsubscribe(symbol, exchange, subsType, cb);
	} catch (err) {
		errorCB(err);
	}
};

const subscribeVirtualErrorCB = (
	asset,
	currency,
	bridge,
	exchange,
	callback,
	errorCB
) => {
	try {
		subscribeVirtual(asset, currency, bridge, exchange, callback);
	} catch (error) {
		errorCB(error);
	}
};

const unSubscribeVirtualErrorCB = (
	asset,
	currency,
	bridge,
	exchange,
	callback,
	errorCB
) => {
	try {
		unsubscribeVirtual(asset, currency, bridge, exchange, callback);
	} catch (error) {
		errorCB(error);
	}
};

const subscribeBasketErrorCB = (
	assets,
	coefficients,
	bridgeCurrency,
	targetAsset,
	exchange,
	callback,
	errorCB
) => {
	try {
		subscribeBasket(
			assets,
			coefficients,
			bridgeCurrency,
			targetAsset,
			exchange,
			callback
		);
	} catch (error) {
		errorCB(error);
	}
};

const unSubscribeBasketErrorCB = (
	assets,
	coefficients,
	bridgeCurrency,
	targetAsset,
	exchange,
	callback,
	errorCB
) => {
	try {
		unsubscribeBasket(
			assets,
			coefficients,
			bridgeCurrency,
			targetAsset,
			exchange,
			callback
		);
	} catch (error) {
		errorCB(error);
	}
};

// const errorCallback = (setState) => {
// 	return (error) => {
// 		setState((state) => {
// 			return { errors: [...state.errors, error] };
// 		});
// 	};
// };

const HulkStore = (set, get) => ({
	auth: null, // { token, tier, email }
	subscriptions: null,
	exchanges: {},
	activeExchange: null,
	isReady: false,
	errors: [],

	setAuth: (auth) => {
		set({ auth });
	},

	logout: () => {
		set({ auth: null, isReady: false, subscriptions: null, exchanges: {}, activeExchange: null });
	},

	init: () => {
		const { auth } = get();
		if (!auth || !auth.token) return;

		console.log('initilize everything');

		initErrorCB(
			{
				auth_server: ['https://web.sd-projects.uk'],
				credentials: { user: auth.email || 'anonymous', password: 'unused' },
				token: auth.token,
				feed_server: auth.feed_server,
			},
			logger,
			(meta) => {
				// create subscription object
				const symbolDict = meta.allowed_instruments;
				const allowed_exchanges = meta.allowed_exchanges;

				const reducedSymbolDict = {};

				for (let [key, value] of symbolDict) {
					if (!reducedSymbolDict[`${value.exchange}`])
						reducedSymbolDict[`${value.exchange}`] = {};
					reducedSymbolDict[`${value.exchange}`][value.symbol] =
						value;
				}

				set((state) => ({
					exchanges: allowed_exchanges.reduce((total, temp) => {
						total[`${temp}`] = {
							symbols: reducedSymbolDict[`${temp}`]
								? reducedSymbolDict[`${temp}`]
								: [],
						};
						return total;
					}, {}),
					subscriptions: allowed_exchanges.reduce((total, temp) => {
						total[`${temp}`] = {
							vanilla: [],
							crossPrices: [],
							baskets: [],
						};
						return total;
					}, {}),
					isReady: true,
				}));
			},
			(error) => {
				setState((state) => {
					return { errors: [...state.errors, error] };
				});
			}
		);
	},

	changeActiveExchange: (newActiveExchange) => {
		// unsubscribe to all current subscripitions
		set((state) => {
			if (state.activeExchange) {
				state.unsubscribeAllInActive(
					state.activeExchange,
					state.subscriptions
				);

				const exchange = state.activeExchange;
				let newSubVanillaActiveExchange = [
					...state.subscriptions[exchange][
						subscriptionTypeEnum.VANILLA
					],
				];
				newSubVanillaActiveExchange = newSubVanillaActiveExchange.map(
					(val) => ({ ...val, cb: null, depth_cb: null })
				);

				let newSubCrossPriceActiveExchange = [
					...state.subscriptions[exchange][
						subscriptionTypeEnum.CROSS_PRICE
					],
				];
				newSubCrossPriceActiveExchange =
					newSubCrossPriceActiveExchange.map((val) => ({
						...val,
						cb: null,
						depth_cb: null,
					}));

				let newSubBucketActiveExchange = [
					...state.subscriptions[exchange][
						subscriptionTypeEnum.BASKETS
					],
				];
				newSubBucketActiveExchange = newSubBucketActiveExchange.map(
					(val) => ({ ...val, cb: null, depth_cb: null })
				);

				return {
					subscriptions: {
						...state.subscriptions,
						[exchange]: {
							...state.subscriptions[exchange],
							[subscriptionTypeEnum.VANILLA]:
								newSubVanillaActiveExchange,
							[subscriptionTypeEnum.CROSS_PRICE]:
								newSubCrossPriceActiveExchange,
							[subscriptionTypeEnum.BASKETS]:
								newSubBucketActiveExchange,
						},
					},
					activeExchange: newActiveExchange,
				};
			} else {
				return {
					activeExchange: newActiveExchange,
				};
			}
		});
	},

	addSubscription: (type, newSubs) => {
		set((state) => {
			const exchange = state.activeExchange;
			const newSubInActiveExchange = [
				...state.subscriptions[exchange][type],
			];
			newSubInActiveExchange.push(newSubs);

			return {
				subscriptions: {
					...state.subscriptions,
					[exchange]: {
						...state.subscriptions[exchange],
						[type]: newSubInActiveExchange,
					},
				},
			};
		});
	},

	removeSubscription: (type, symbol) => {
		set((state) => {
			const exchange = state.activeExchange;
			let newSubInActiveExchange = [
				...state.subscriptions[exchange][type],
			];
			newSubInActiveExchange = newSubInActiveExchange.filter(
				(val) => val.symbol != symbol
			);

			return {
				subscriptions: {
					...state.subscriptions,
					[exchange]: {
						...state.subscriptions[exchange],
						[type]: newSubInActiveExchange,
					},
				},
			};
		});
	},

	manageDepthSubscription: (type, symbol, action) => {
		set((state) => {
			const exchange = state.activeExchange;
			let newSubInActiveExchange = [
				...state.subscriptions[exchange][type],
			];
			newSubInActiveExchange = newSubInActiveExchange.map((val) => {
				if (val.symbol == symbol) {
					return {
						...val,
						depth: action,
					};
				} else {
					return val;
				}
			});

			return {
				subscriptions: {
					...state.subscriptions,
					[exchange]: {
						...state.subscriptions[exchange],
						[type]: newSubInActiveExchange,
					},
				},
			};
		});
	},

	subscribe: (type, symbol, exchange, subsType, cb, subsObject = {}) => {
		const errorCallback = (error) => {
			set((state) => {
				const exchange = state.activeExchange;
				let newSubInActiveExchange = [
					...state.subscriptions[exchange][type],
				];
				newSubInActiveExchange = newSubInActiveExchange.filter(
					(val) => val.symbol != symbol
				);

				return {
					subscriptions: {
						...state.subscriptions,
						[exchange]: {
							...state.subscriptions[exchange],
							[type]: newSubInActiveExchange,
						},
					},
					errors: [...state.errors, error],
				};
			});
		};

		switch (type) {
			case subscriptionTypeEnum.VANILLA:
				subscribeErrorCB(symbol, exchange, subsType, cb, errorCallback);
				break;
			case subscriptionTypeEnum.CROSS_PRICE:
				subscribeVirtualErrorCB(
					subsObject.baseAssets[0],
					subsObject.baseAssets[1],
					subsObject.quoteAsset,
					exchange,
					cb,
					errorCallback
				);
				break;
			case subscriptionTypeEnum.BASKETS:
				const assets = [];
				const cofficeints = [];

				subsObject.assets.forEach((sub) => {
					assets.push(sub.baseAsset);
					cofficeints.push(sub.count);
				});

				subscribeBasketErrorCB(
					assets,
					cofficeints,
					subsObject.assets[0].quoteAsset,
					subsObject.destinationSymbol,
					exchange,
					cb,
					errorCallback
				);
				break;
			default:
				throw new Error('Incorrect Subscription Type');
		}

		set((state) => {
			const exchange = state.activeExchange;
			let newSubInActiveExchange = [
				...state.subscriptions[exchange][type],
			];
			newSubInActiveExchange = newSubInActiveExchange.map((val) => {
				if (val.symbol == symbol) {
					return {
						...val,
						cb: subsType == subsTypeEnum.TRADE ? cb : val.cb,
						depth_cb:
							subsType == subsTypeEnum.DEPTH ? cb : val.depth_cb,
					};
				} else {
					return val;
				}
			});

			return {
				subscriptions: {
					...state.subscriptions,
					[exchange]: {
						...state.subscriptions[exchange],
						[type]: newSubInActiveExchange,
					},
				},
			};
		});
	},

	unsubscribe: (type, symbol, exchange, subsType, cb, subsObject = {}) => {
		const errorCallback = (error) => {
			set((state) => {
				return { errors: [...state.errors, error] };
			});
		};

		switch (type) {
			case subscriptionTypeEnum.VANILLA:
				unsubscribeErrorCB(
					symbol,
					exchange,
					subsType,
					cb,
					errorCallback
				);
				break;
			case subscriptionTypeEnum.CROSS_PRICE:
				unSubscribeVirtualErrorCB(
					subsObject.baseAssets[0],
					subsObject.baseAssets[1],
					subsObject.quoteAsset,
					exchange,
					cb,
					errorCallback
				);
				break;
			case subscriptionTypeEnum.BASKETS:
				const assets = [];
				const cofficeints = [];

				subsObject.assets.forEach((sub) => {
					assets.push(sub.baseAsset);
					cofficeints.push(sub.count);
				});

				unSubscribeBasketErrorCB(
					assets,
					cofficeints,
					subsObject.assets[0].quoteAsset,
					subsObject.destinationSymbol,
					exchange,
					cb,
					errorCallback
				);
				break;
			default:
				throw new Error('Incorrect Subscription Type');
		}

		set((state) => {
			const exchange = state.activeExchange;
			let newSubInActiveExchange = [
				...state.subscriptions[exchange][type],
			];
			newSubInActiveExchange = newSubInActiveExchange.map((val) => {
				if (val.symbol == symbol) {
					return {
						...val,
						cb: subsType == subsTypeEnum.TRADE ? null : val.cb,
						depth_cb:
							subsType == subsTypeEnum.DEPTH
								? null
								: val.depth_cb,
					};
				} else {
					return val;
				}
			});

			return {
				subscriptions: {
					...state.subscriptions,
					[exchange]: {
						...state.subscriptions[exchange],
						[type]: newSubInActiveExchange,
					},
				},
			};
		});
	},

	unsubscribeAllInActive: (activeExchange, subs) => {
		// unsubscribe all the exsisting subs
		console.log('unsubsrrine all current once');

		const errorCallback = (error) => {
			console.log('error occured while unsubscribing', error.message);
		};

		subs[activeExchange].vanilla.forEach((sub) => {
			if (sub.cb)
				unsubscribeErrorCB(
					sub.symbol,
					activeExchange,
					subsTypeEnum.TRADE,
					sub.cb,
					errorCallback
				);

			if (sub.depth_cb) {
				unsubscribeErrorCB(
					sub.symbol,
					activeExchange,
					subsTypeEnum.DEPTH,
					sub.depth_cb,
					errorCallback
				);
			}
		});

		subs[activeExchange].crossPrices.forEach((sub) => {
			if (sub.cb)
				unSubscribeVirtualErrorCB(
					sub.baseAssets[0],
					sub.baseAssets[1],
					sub.quoteAsset,
					activeExchange,
					sub.cb,
					errorCallback
				);
		});

		subs[activeExchange].baskets.forEach((subsObject) => {
			if (subsObject.cb) {
				const assets = [];
				const cofficeints = [];

				subsObject.assets.forEach((sub) => {
					assets.push(sub.baseAsset);
					cofficeints.push(sub.count);
				});

				unSubscribeBasketErrorCB(
					assets,
					cofficeints,
					subsObject.assets[0].quoteAsset,
					subsObject.destinationSymbol,
					activeExchange,
					subsObject.cb,
					errorCallback
				);
			}
		});
	},

	clearErrors: () => {
		set((state) => {
			return { errors: [] };
		});
	},
});

export const useHulkStore = create(HulkStore);
