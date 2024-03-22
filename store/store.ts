import { StateCreator } from 'zustand/vanilla';
import { createFeathersClient } from '@/feathers-client';
// @types
import { TAuthStore } from './types';

export const createAuthStore =
	(): StateCreator<TAuthStore, [], [], TAuthStore> => (set) => ({
		feathersClient: createFeathersClient(),
		isAuthenticated: false,
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
		user: {
			_id: null,
			email: null,
			firstName: null,
			lastName: null,
			profilePicture: null,
		},
		setUser: (payload) =>
			set((state) => {
				return { ...state, user: payload };
			}),
		signup: async (payload: {
			email: string;
			password: string;
			firstName: string;
			lastName: string;
		}) => {
			try {
				const result = await createFeathersClient()
					.service('users')
					.create({
						email: payload.email,
						password: payload.password,
						firstName: payload.firstName,
						lastName: payload.lastName,
					});

				set((state) => ({
					...state,
					isAuthenticated: true,
					feathersClient: state.feathersClient,
					user: {
						_id: result._id,
						email: result.email,
						firstName: result.firstName,
						lastName: result.lastName,
						profilePicture: result.profilePicture,
					},
				}));

				return { success: true, message: 'Signup successful' };
			} catch (error) {
				console.error('Signup failed', error);
				return {
					success: false,
					message: 'Signup failed. An error occurred.',
				};
			}
		},

		login: async (payload: { email: string; password: string }) => {
			try {
				const result = await createFeathersClient().authenticate({
					strategy: 'local',
					email: payload.email,
					password: payload.password,
				});

				set((state) => ({
					...state,
					feathersClient: state.feathersClient,
					isAuthenticated: true,
					user: result.user,
				}));

				return { success: true, message: 'Login successful' };
			} catch (error) {
				console.error('Login failed', error);
				return {
					success: false,
					message: 'Login failed. Please check your credentials.',
				};
			}
		},
		logout: async () => {
			try {
				await createFeathersClient().logout();

				set((state: TAuthStore) => ({
					...state,
					feathersClient: state.feathersClient,
					isAuthenticated: false,
					user: {
						_id: null,
						email: null,
						firstName: null,
						lastName: null,
						profilePicture: null,
					},
				}));

				return { success: true, message: 'Logout successful' };
			} catch (error) {
				console.error('Logout failed', error);
				return {
					success: false,
					message: 'Logout failed. An error occurred.',
				};
			}
		},
		checkAuthentication: async () => {
			try {
				const { user } = await createFeathersClient().reAuthenticate();

				if (user) {
					set((state) => ({
						...state,
						feathersClient: state.feathersClient,
						isAuthenticated: true,
						user,
					}));
				} else {
					set((state) => ({
						...state,
						feathersClient: state.feathersClient,
						isAuthenticated: false,
						user: {
							_id: null,
							email: null,
							firstName: null,
							lastName: null,
							profilePicture: null,
						},
					}));
				}
				return { success: true, message: 'Authentication successful' };
			} catch (error) {
				console.error('Error checking authentication', error);
				return {
					success: false,
					message: 'Authentication failed. An error occurred.',
				};
			}
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
				productId: number;
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
			productId: number;
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
				productId: number;
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
			productId: number;
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
			productId: number;
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
			productId: number;
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

export default createAuthStore;
