import { StateCreator } from 'zustand/vanilla';
import { createFeathersClient } from '@/feathers-client';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { TDataStore } from './types';

export const createDataStore =
	(): StateCreator<TDataStore, [], [], TDataStore> => (set) => ({
		feathersClient: createFeathersClient(),
		setCartItem: (payload) => {
			set((state) => {
				return { ...state, cart: payload };
			});
		},
		cart: {
			_id: null,
			userId: null,
			items: [],
		},
		getCart: async (payload: { userId: string }) => {
			try {
				const results = await createFeathersClient()
					.service('custom/get-cart')
					.get(payload.userId);

				if (results) {
					set((state) => ({
						...state,
						isAuthenticated: true,
						feathersClient: state.feathersClient,
						cart: results,
					}));
				}

				return {
					success: true,
					message: 'Cart fetched successfully.',
				};
			} catch (error) {
				return {
					success: false,
					message: 'Error fetching cart. An error occurred.',
				};
			}
		},
		addToCart: async (payload: {
			userId: string;
			items: {
				productId: string;
				quantity: number;
				price: number;
				itemPicture: string;
				itemName: string;
			};
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/add-to-cart')
					.create({
						userId: payload.userId,
						payload: { items: payload.items },
					});

				if (results) {
					set((state) => ({
						...state,
						isAuthenticated: true,
						feathersClient: state.feathersClient,
						cart: results,
					}));
				}

				return {
					success: true,
					message: 'Items added to cart successfully.',
				};
			} catch (error) {
				return {
					success: false,
					message: 'Error adding items to cart. An error occurred.',
				};
			}
		},
		removeFromCart: async (payload: {
			userId: string;
			productId: string;
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/remove-from-cart')
					.create(payload);

				if (results) {
					set((state) => ({
						...state,
						isAuthenticated: true,
						feathersClient: state.feathersClient,
						cart: results,
					}));
				}

				return {
					success: true,
					message: 'Items removed from cart successfully.',
				};
			} catch (error) {
				return {
					success: false,
					message:
						'Error removing items from cart. An error occurred.',
				};
			}
		},
		getTotal: async (payload: { userId: string }) => {
			try {
				const results = await createFeathersClient()
					.service('custom/get-total')
					.get(payload.userId);

				if (results) {
					return {
						success: true,
						totals: {
							totalPrice: results.totalPrice || 0,
							totalNumberOfItems: results.totalNumberOfItems || 0,
						},
					};
				}

				return {
					success: false,
					totals: {
						totalPrice: 0,
						totalNumberOfItems: 0,
					},
				};
			} catch (error) {
				return {
					success: false,
					totals: {
						totalPrice: 0,
						totalNumberOfItems: 0,
					},
				};
			}
		},
		// wishlist
		addToWishlist: async (payload: {
			userId: string;
			items: {
				productId: string;
				price: number;
				itemPicture: string;
				itemName: string;
			};
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/add-to-wishlist')
					.create({
						userId: payload.userId,
						payload: { items: payload.items },
					});

				if (results) {
					return {
						success: true,
						message: 'Item added to wishlist successfully.',
					};
				}

				return {
					success: false,
					message:
						'Error adding item to wishlist. An error occurred.',
				};
			} catch (error) {
				return {
					success: false,
					message:
						'Error adding item to wishlist. An error occurred.',
				};
			}
		},
		AddedToWishlist: async (payload: {
			userId: string;
			productId: string;
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/added-to-wishlist')
					.create(payload);

				if (results) {
					return {
						success: true,
						alreadyExists: true,
					};
				}

				return {
					success: false,
					alreadyExists: false,
				};
			} catch (error) {
				return {
					success: false,
					alreadyExists: false,
				};
			}
		},

		removeFromWishlist: async (payload: {
			userId: string;
			productId: string;
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/remove-from-wishlist')
					.create(payload);

				if (results) {
					return {
						success: true,
						message: 'Item removed from wishlist successfully.',
					};
				}

				return {
					success: false,
					message:
						'Error removing item from wishlist. An error occurred.',
				};
			} catch (error) {
				return {
					success: false,
					message:
						'Error removing item from wishlist. An error occurred.',
				};
			}
		},
		getWishlist: async (payload: { userId: string }) => {
			try {
				const results = await createFeathersClient()
					.service('custom/get-wishlist')
					.get(payload.userId);

				if (results) {
					return {
						success: true,
						wishlist: results,
					};
				}

				return {
					success: false,
					wishlist: {
						_id: null,
						userId: null,
						items: [],
					},
				};
			} catch (error) {
				return {
					success: false,
					wishlist: {
						_id: null,
						userId: null,
						items: [],
					},
				};
			}
		},
		updateQuantity: async (payload: {
			userId: string;
			productId: string;
			newQuantity: number;
		}) => {
			try {
				const results = await createFeathersClient()
					.service('custom/update-quantity')
					.create(payload);

				if (results) {
					return {
						success: true,
						message: 'Quantity updated successfully.',
					};
				}

				return {
					success: false,
					message: 'Error updating quantity. An error occurred.',
				};
			} catch (error) {
				return {
					success: false,
					message: 'Error updating quantity. An error occurred.',
				};
			}
		},
	});

export default createDataStore;
