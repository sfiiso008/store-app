import { StateCreator } from 'zustand/vanilla';
import { createFeathersClient } from '@/feathers-client';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { TAuthStore } from './types';

export const createAuthStore =
	(): StateCreator<TAuthStore, [], [], TAuthStore> => (set) => ({
		feathersClient: createFeathersClient(),
		isAuthenticated: false,
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
				return {
					success: false,
					message: 'Login failed. Please check your credentials.',
				};
			}
		},
		updateUser: async (
			userId: string,
			payload: {
				lastName: string;
				firstName: string;
				email: string;
			}
		) => {
			try {
				const result = await createFeathersClient()
					.service('users')
					.patch(userId, payload);

				if (result) {
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
				}

				return { success: true, message: 'User updated successfully' };
			} catch (error) {
				console.error('User update failed', error);
				return {
					success: false,
					message: 'User update failed. An error occurred.',
				};
			}
		},
		updateProfilePic: async (file: FileList, userId: string) => {
			try {
				const accessToken =
					await createFeathersClient().authentication.getAccessToken();

				const uploadResult = await apiFunctions.uploadFile(file);

				if (!uploadResult || !uploadResult.urls) {
					return {
						success: false,
						message: 'Upload failed. An error occurred.',
					};
				}

				const { urls } = uploadResult;

				const result = await createFeathersClient()
					.service('users')
					.patch(
						userId,
						{
							profilePicture: urls[0],
						},
						{
							headers: {
								Authorization: `Bearer ${accessToken}`,
							},
						}
					);

				if (result) {
					set((state) => ({
						...state,
						isAuthenticated: true,
						feathersClient: state.feathersClient,
						user: {
							...state.user,
							profilePicture: result.profilePicture,
						},
					}));
				}

				return { success: true, message: 'Profile picture updated' };
			} catch (error) {
				return {
					success: false,
					message:
						'Profile picture update failed. An error occurred.',
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
	});

export default createAuthStore;
